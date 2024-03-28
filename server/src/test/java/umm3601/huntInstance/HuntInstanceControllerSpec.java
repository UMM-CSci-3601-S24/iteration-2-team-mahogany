package umm3601.huntInstance;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Map;

import org.bson.Document;
import org.bson.types.ObjectId;
import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import org.mockito.Captor;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.MockitoAnnotations;

import com.mongodb.MongoClientSettings;
import com.mongodb.ServerAddress;
import com.mongodb.client.MongoClient;
import com.mongodb.client.MongoClients;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoDatabase;

import io.javalin.Javalin;
import io.javalin.http.Context;
import io.javalin.http.servlet.Task;
import io.javalin.json.JavalinJackson;
import umm3601.host.CompleteHunt;
import umm3601.host.Host;
import umm3601.host.HostController;
import umm3601.host.Hunt;

public class HuntInstanceControllerSpec {

  @SuppressWarnings({ "MagicNumber" })
  public class HostControllerSpec {
  private HostController hostController;
  private ObjectId frysId;
  private ObjectId huntId;
  private ObjectId taskId;

  private static MongoClient mongoClient;
  private static MongoDatabase db;
  private static JavalinJackson javalinJackson = new JavalinJackson();

  @Mock
  private Context ctx;

  @Captor
  private ArgumentCaptor<ArrayList<Hunt>> huntArrayListCaptor;

  @Captor
  private ArgumentCaptor<ArrayList<Task>> taskArrayListCaptor;

  @Captor
  private ArgumentCaptor<Host> hostCaptor;

  @Captor
  private ArgumentCaptor<CompleteHunt> completeHuntCaptor;

  @Captor
  private ArgumentCaptor<Map<String, String>> mapCaptor;

  @BeforeAll
  static void setupAll() {
    String mongoAddr = System.getenv().getOrDefault("MONGO_ADDR", "localhost");

    mongoClient = MongoClients.create(
      MongoClientSettings.builder()
        .applyToClusterSettings(builder -> builder.hosts(Arrays.asList(new ServerAddress(mongoAddr))))
        .build());
      db = mongoClient.getDatabase("test");
  }

  @AfterAll
  static void teardown() {
    db.drop();
    mongoClient.close();
  }

  @BeforeEach
  void setupEach() throws IOException {
    MockitoAnnotations.openMocks(this);

    MongoCollection<Document> huntInstanceDocuments = db.getCollection("huntInstances");
    huntInstanceDocuments.drop();
    frysId = new ObjectId();
    Document fry = new Document()
      .append("_id", frysId)
      .append("name", "Fry")
      .append("userName", "fry")
      .append("email", "fry@email");

    huntInstanceDocuments.insertOne(fry);

    MongoCollection<Document> huntDocuments = db.getCollection("hunts");
    huntDocuments.drop();
    List<Document> testHunts = new ArrayList<>();
    testHunts.add(
      new Document()
        .append("hostId", "frysId")
        .append("name", "Fry's Hunt")
        .append("description", "Fry's hunt for the seven leaf clover")
        .append("est", 20)
        .append("numberOfTasks", 5));
    testHunts.add(
      new Document()
        .append("hostId", "frysId")
        .append("name", "Fry's Hunt 2")
        .append("description", "Fry's hunt for Morris")
        .append("est", 30)
        .append("numberOfTasks", 2));
    testHunts.add(
      new Document()
        .append("hostId", "frysId")
        .append("name", "Fry's Hunt 3")
        .append("description", "Fry's hunt for money")
        .append("est", 40)
        .append("numberOfTasks", 1));
    testHunts.add(
      new Document()
        .append("hostId", "differentId")
        .append("name", "Different's Hunt")
        .append("description", "Different's hunt for money")
        .append("est", 60)
        .append("numberOfTasks", 10));

        huntId = new ObjectId();
    Document hunt = new Document()
      .append("_id", huntId)
      .append("hostId", "frysId")
      .append("name", "Best Hunt")
      .append("description", "This is the best hunt")
      .append("est", 20)
      .append("numberOfTasks", 3);

    huntDocuments.insertMany(testHunts);
    huntDocuments.insertOne(hunt);

    MongoCollection<Document> taskDocuments = db.getCollection("tasks");
    taskDocuments.drop();
    List<Document> testTasks = new ArrayList<>();
    testTasks.add(
      new Document()
        .append("huntId", huntId.toHexString())
        .append("name", "Take a picture of a cat")
        .append("status", false));
    testTasks.add(
      new Document()
        .append("huntId", huntId.toHexString())
        .append("name", "Take a picture of a dog")
        .append("status", false));
    testTasks.add(
      new Document()
        .append("huntId", huntId.toHexString())
        .append("name", "Take a picture of a park")
        .append("status", true));
    testTasks.add(
      new Document()
        .append("huntId", "differentId")
        .append("name", "Take a picture of a moose")
        .append("status", true));

        taskId = new ObjectId();
        Document task = new Document()
          .append("_id", taskId)
          .append("huntId", "someId")
          .append("name", "Best Task")
          .append("status", false);

    taskDocuments.insertMany(testTasks);
    taskDocuments.insertOne(task);

    hostController = new HostController(db);
  }

  @Test
  void addRoutes() {
    Javalin mockServer = mock(Javalin.class);
    huntInstanceController.addRoutes(mockServer);
    verify(mockServer, Mockito.atLeast(1)).get(any(), any());
  }



}
