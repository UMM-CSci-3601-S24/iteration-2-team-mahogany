package umm3601.photo;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Arrays;

import org.bson.Document;
import org.bson.AbstractBsonWriter.Context;
import org.bson.types.ObjectId;
import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.BeforeEach;
import org.mockito.ArgumentCaptor;
import org.mockito.Captor;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import com.mongodb.MongoClientSettings;
import com.mongodb.ServerAddress;
import com.mongodb.client.MongoClient;
import com.mongodb.client.MongoClients;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoDatabase;

import io.javalin.json.JavalinJackson;

public class photostoragespec {
  private PhotoController photoController;
  private ObjectId photoId;

  private static MongoClient mongoClient;
  private MongoDatabase db;
  private static JavalinJackson javalinJackson = new JavalinJackson();

  @Mock
  private Context ctx;

  @Captor
  private ArgumentCaptor<ArrayList<Photo>> photoArrayListCaptor;

  @BeforeAll
  static void setupAll() {
    String mongoAddr = System.getenv().getOrDefault("MONGO_ADDR", "localhost");

    mongoClient = MongoClients.create(
      MongoClientSettings.builder()
      .applyToClusterSettings(builder -> builder.photos(Arrays.asList(new ServerAddress(mongoAddr))))
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

    MongoCollection<Document> photodocuments = db.getCollection("photos");
    photodocuments.drop();
    dogsId = new ObjectId();
    Document dog = new Document()
    .append("_id", dogsId)
    .append("photo", )
  }
}
