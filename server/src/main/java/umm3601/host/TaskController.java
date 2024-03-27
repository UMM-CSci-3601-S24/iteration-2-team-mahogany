package umm3601.host;

import org.bson.UuidRepresentation;
import org.mongojack.JacksonMongoCollection;

import com.mongodb.client.MongoDatabase;

import umm3601.Controller;

public class TaskController implements Controller {
  private static final String API_TASK = "/api/tasks/{id}";
  private static final String API_TASKS = "/api/tasks";

  static final int REASONABLE_NAME_LENGTH_TASK = 150;

  private final JacksonMongoCollection<Task> taskCollection;

  public TaskController(MongoDatabase database) {
    taskCollection = JacksonMongoCollection.builder().build(
      database,
      "tasks",
      Task.class,
       UuidRepresentation.STANDARD);
  }
}
