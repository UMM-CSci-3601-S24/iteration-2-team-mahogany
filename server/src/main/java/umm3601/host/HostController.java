package umm3601.host;

import io.javalin.Javalin;
import io.javalin.http.BadRequestResponse;
import io.javalin.http.Context;
import io.javalin.http.HttpStatus;
import io.javalin.http.InternalServerErrorResponse;
import io.javalin.http.NotFoundResponse;
import umm3601.Controller;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardCopyOption;

import static com.mongodb.client.model.Filters.and;
import static com.mongodb.client.model.Filters.eq;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.UUID;

import org.bson.Document;
import org.bson.UuidRepresentation;
import org.bson.conversions.Bson;
import org.bson.types.ObjectId;
import org.mongojack.JacksonMongoCollection;

import com.mongodb.client.MongoDatabase;
import com.mongodb.client.model.Sorts;
import com.mongodb.client.result.DeleteResult;

public class HostController implements Controller {

  private static final String API_HOST = "/api/hosts/{id}";
  private static final String API_HUNT = "/api/hunts/{id}";
  private static final String API_HUNTS = "/api/hunts";
  private static final String API_TASK = "/api/tasks/{id}";
  private static final String API_TASKS = "/api/tasks";


  private static final String API_UPLOAD = "/api/upload";
  private static final String API_PHOTO = "/api/photo/{filename}";

  static final String HOST_KEY = "hostId";
  static final String HUNT_KEY = "huntId";

  static final int REASONABLE_NAME_LENGTH_HUNT = 50;
  static final int REASONABLE_DESCRIPTION_LENGTH_HUNT = 200;
  private static final int REASONABLE_EST_LENGTH_HUNT = 240;

  static final int REASONABLE_NAME_LENGTH_TASK = 150;

  private static final int STATUS_OK = 200;
  private static final int STATUS_BAD_REQUEST = 400;
  private static final int STATUS_INTERNAL_SERVER_ERROR = 500;

  private final JacksonMongoCollection<Host> hostCollection;
  private final JacksonMongoCollection<Hunt> huntCollection;
  private final JacksonMongoCollection<Task> taskCollection;

  private final FileFactory fileFactory;

  public HostController(MongoDatabase database, FileFactory fileFactory) {
    this.fileFactory = fileFactory;
    hostCollection = JacksonMongoCollection.builder().build(
      database,
      "hosts",
      Host.class,
       UuidRepresentation.STANDARD);
    huntCollection = JacksonMongoCollection.builder().build(
      database,
      "hunts",
      Hunt.class,
       UuidRepresentation.STANDARD);
    taskCollection = JacksonMongoCollection.builder().build(
      database,
      "tasks",
      Task.class,
       UuidRepresentation.STANDARD);
  }

public void uploadPhoto(Context ctx) {
  try {
    var uploadedFile = ctx.uploadedFile("photo");
    if (uploadedFile != null) {
      try (InputStream in = uploadedFile.content()) {
        // Generate a unique ID for the file
        String id = UUID.randomUUID().toString();

        // Use the ID as the filename, but keep the original file extension
        String extension = getFileExtension(uploadedFile.filename());
        File file = Path.of("uploads", id + "." + extension).toFile();

        Files.copy(in, file.toPath(), StandardCopyOption.REPLACE_EXISTING);
        ctx.status(STATUS_OK).result("Photo uploaded successfully with ID: " + id);
      }
    } else {
      ctx.status(STATUS_BAD_REQUEST).result("Missing photo");
    }
  } catch (Exception e) {
    e.printStackTrace(); // This will print the full stack trace to the server logs
    ctx.status(STATUS_INTERNAL_SERVER_ERROR).result("Photo upload failed: " + e.getMessage());
  }
}


private String getFileExtension(String filename) {
  int dotIndex = filename.lastIndexOf('.');
  if (dotIndex >= 0) {
    return filename.substring(dotIndex + 1);
  } else {
    return ""; // No extension
  }
}

public void getPhoto(Context ctx) {
  String filename = ctx.pathParam("filename");
  File file = this.fileFactory.create("uploads/" + filename);
  if (file.exists()) {
    try {
      FileInputStream fileInputStream = this.fileFactory.createInputStream(file);
      ctx.result(fileInputStream);
    } catch (FileNotFoundException e) {
      ctx.status(STATUS_INTERNAL_SERVER_ERROR).result("Error reading file: " + e.getMessage());
    }
  } else {
    ctx.status(STATUS_BAD_REQUEST).result("Photo not found");
  }
}

public void deletePhoto(Context ctx) {
  String filename = ctx.pathParam("filename");
  File file = new File("uploads/" + filename);
  if (file.exists()) {
      if (file.delete()) {
          ctx.status(STATUS_OK).result("Photo deleted successfully");
      } else {
          ctx.status(STATUS_INTERNAL_SERVER_ERROR).result("Error deleting file");
      }
  } else {
      ctx.status(STATUS_BAD_REQUEST).result("Photo not found");
  }

}

  public void getHost(Context ctx) {
    String id = ctx.pathParam("id");
    Host host;

    try {
      host = hostCollection.find(eq("_id", new ObjectId(id))).first();
    } catch (IllegalArgumentException e) {
      throw new BadRequestResponse("The requested host id wasn't a legal Mongo Object ID.");
    }
    if (host == null) {
      throw new NotFoundResponse("The requested host was not found");
    } else {
      ctx.json(host);
      ctx.status(HttpStatus.OK);
    }
  }

  public Hunt getHunt(Context ctx) {
    String id = ctx.pathParam("id");
    Hunt hunt;

    try {
      hunt = huntCollection.find(eq("_id", new ObjectId(id))).first();
    } catch (IllegalArgumentException e) {
      throw new BadRequestResponse("The requested hunt id wasn't a legal Mongo Object ID.");
    }
    if (hunt == null) {
      throw new NotFoundResponse("The requested hunt was not found");
    } else {
      return hunt;
    }
  }

  public void getHunts(Context ctx) {
    Bson combinedFilter = constructFilterHunts(ctx);
    Bson sortingOrder = constructSortingOrderHunts(ctx);

    ArrayList<Hunt> matchingHunts = huntCollection
      .find(combinedFilter)
      .sort(sortingOrder)
      .into(new ArrayList<>());

    ctx.json(matchingHunts);

    ctx.status(HttpStatus.OK);
  }

  private Bson constructFilterHunts(Context ctx) {
    List<Bson> filters = new ArrayList<>();

    if (ctx.queryParamMap().containsKey(HOST_KEY)) {
      String targetHost = ctx.queryParamAsClass(HOST_KEY, String.class).get();
      filters.add(eq(HOST_KEY, targetHost));
    }

    Bson combinedFilter = filters.isEmpty() ? new Document() : and(filters);

    return combinedFilter;
  }

  private Bson constructSortingOrderHunts(Context ctx) {
    String sortBy = Objects.requireNonNullElse(ctx.queryParam("sortby"), "name");
    Bson sortingOrder = Sorts.ascending(sortBy);
    return sortingOrder;
  }

  public ArrayList<Task> getTasks(Context ctx) {
    Bson sortingOrder = constructSortingOrderTasks(ctx);

    String targetHunt = ctx.pathParam("id");

    ArrayList<Task> matchingTasks = taskCollection
      .find(eq(HUNT_KEY, targetHunt))
      .sort(sortingOrder)
      .into(new ArrayList<>());

    return matchingTasks;
  }
  public void getTask(Context ctx) {
    String id = ctx.pathParam("id");
    Task task;

    try {
      task = taskCollection.find(eq("_id", new ObjectId(id))).first();
    } catch (IllegalArgumentException e) {
      throw new BadRequestResponse("The requested task id wasn't a legal Mongo Object ID.");
    }
    if (task == null) {
      throw new NotFoundResponse("The requested task was not found");
    } else {
      ctx.json(task);
    }
}

  private Bson constructSortingOrderTasks(Context ctx) {
    String sortBy = Objects.requireNonNullElse(ctx.queryParam("sortby"), "name");
    Bson sortingOrder = Sorts.ascending(sortBy);
    return sortingOrder;
  }

  public void addNewHunt(Context ctx) {
    Hunt newHunt = ctx.bodyValidator(Hunt.class)
    .check(hunt -> hunt.hostId != null && hunt.hostId.length() > 0, "Invalid hostId")
    .check(hunt -> hunt.name.length() < REASONABLE_NAME_LENGTH_HUNT, "Name must be less than 50 characters")
    .check(hunt -> hunt.name.length() > 0, "Name must be at least 1 character")
    .check(hunt -> hunt.description.length() < REASONABLE_DESCRIPTION_LENGTH_HUNT,
     "Description must be less than 200 characters")
    .check(hunt -> hunt.est <= REASONABLE_EST_LENGTH_HUNT, "Estimated time must be less than 4 hours")
    .get();

    huntCollection.insertOne(newHunt);
    ctx.json(Map.of("id", newHunt._id));
    ctx.status(HttpStatus.CREATED);
  }

  public void addNewTask(Context ctx) {
    Task newTask = ctx.bodyValidator(Task.class)
    .check(task -> task.huntId != null && task.huntId.length() > 0, "Invalid huntId")
    .check(task -> task.name.length() < REASONABLE_NAME_LENGTH_TASK, "Name must be less than 150 characters")
    .check(task -> task.name.length() > 0, "Name must be at least 1 character")
    .get();

    taskCollection.insertOne(newTask);
    increaseTaskCount(newTask.huntId);
    ctx.json(Map.of("id", newTask._id));
    ctx.status(HttpStatus.CREATED);
  }

  public void increaseTaskCount(String huntId) {
    try {
      huntCollection.findOneAndUpdate(eq("_id", new ObjectId(huntId)),
       new Document("$inc", new Document("numberOfTasks", 1)));
    } catch (Exception e) {
      e.printStackTrace();
    }
  }

  public void deleteHunt(Context ctx) {
    String id = ctx.pathParam("id");
    DeleteResult deleteResult = huntCollection.deleteOne(eq("_id", new ObjectId(id)));
    if (deleteResult.getDeletedCount() != 1) {
      ctx.status(HttpStatus.NOT_FOUND);
      throw new NotFoundResponse(
        "Was unable to delete ID "
          + id
          + "; perhaps illegal ID or an ID for an item not in the system?");
    }
    deleteTasks(ctx);
    ctx.status(HttpStatus.OK);
  }

public void updateHunt(Context ctx) {
  String id = ctx.pathParam("id");
  Hunt updatedHunt = ctx.bodyAsClass(Hunt.class);
  Hunt hunt;

  try {
    hunt = huntCollection.findOne(eq("_id", new ObjectId(id)));
  } catch (IllegalArgumentException e) {
    throw new BadRequestResponse("The requested hunt id wasn't a legal Mongo Object ID.");
  }

  if (hunt == null) {
    throw new NotFoundResponse("The requested hunt was not found");
  } else {
try {
  hunt = huntCollection.findOneAndReplace(eq("_id", new ObjectId(id)), updatedHunt);
  ctx.json(hunt);
  ctx.status(HttpStatus.OK);
} catch (Exception e) {
  e.printStackTrace(); // This will print the stack trace of the exception to the console
  throw new InternalServerErrorResponse("Error updating the hunt.");
}
  }


}
  public void updateTask(Context ctx) {
  String id = ctx.pathParam("id");
  Task updatedTask = ctx.bodyAsClass(Task.class);
  Task task;

  try {
    task = taskCollection.findOne(eq("_id", new ObjectId(id)));
  } catch (IllegalArgumentException e) {
    throw new BadRequestResponse("The requested task id wasn't a legal Mongo Object ID.");
  }

  if (task == null) {
    throw new NotFoundResponse("The requested task was not found");
  } else {
    try {
      System.out.println("Updated task: " + updatedTask);
      task = taskCollection.findOneAndReplace(eq("_id", new ObjectId(id)), updatedTask);
      System.out.println("Result of findOneAndReplace: " + task);
      ctx.json(task);
      ctx.status(HttpStatus.OK);
    } catch (Exception e) {
      e.printStackTrace(); // This will print the stack trace of the exception to the console
      throw new InternalServerErrorResponse("Error updating the task.");
    }
  }
}

  public void deleteTask(Context ctx) {
    String id = ctx.pathParam("id");
    try {
      String huntId = taskCollection.find(eq("_id", new ObjectId(id))).first().huntId;
      taskCollection.deleteOne(eq("_id", new ObjectId(id)));
      decreaseTaskCount(huntId);
    } catch (Exception e) {
      ctx.status(HttpStatus.NOT_FOUND);
      throw new NotFoundResponse(
        "Was unable to delete ID "
          + id
          + "; perhaps illegal ID or an ID for an item not in the system?");
    }
    ctx.status(HttpStatus.OK);
  }

  public void decreaseTaskCount(String huntId) {
    try {
      huntCollection.findOneAndUpdate(eq("_id", new ObjectId(huntId)),
       new Document("$inc", new Document("numberOfTasks", -1)));
    } catch (Exception e) {
      e.printStackTrace();
    }
  }

  public void deleteTasks(Context ctx) {
    String huntId = ctx.pathParam("id");
    taskCollection.deleteMany(eq("huntId", huntId));
  }

  public void getCompleteHunt(Context ctx) {
    CompleteHunt completeHunt = new CompleteHunt();
    completeHunt.hunt = getHunt(ctx);
    completeHunt.tasks = getTasks(ctx);

    ctx.json(completeHunt);
    ctx.status(HttpStatus.OK);
  }

  @Override
  public void addRoutes(Javalin server) {
    server.get(API_HOST, this::getHunts);
    server.get(API_HUNT, this::getCompleteHunt);
    server.post(API_HUNTS, this::addNewHunt);
    server.get(API_TASKS, this::getTasks);
    server.post(API_TASKS, this::addNewTask);
    server.delete(API_HUNT, this::deleteHunt);
    server.delete(API_TASK, this::deleteTask);
    server.put(API_HUNT, this::updateHunt);
    server.put(API_TASK, this::updateTask);
    server.get(API_TASK, this::getTask);

    server.delete(API_PHOTO, this::deletePhoto);
    server.post(API_UPLOAD, this::uploadPhoto);
    server.get(API_PHOTO, this::getPhoto);

  }
}
