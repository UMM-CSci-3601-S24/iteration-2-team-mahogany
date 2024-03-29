package umm3601.host;
import org.bson.types.ObjectId;
import java.util.List;

public class HuntInstance {
  private ObjectId id;  // Use ObjectId instead of String for the ID
  private String huntId;
  private List<Task> submissions;

  public HuntInstance(String huntId, List<Task> submissions) {
      this.huntId = huntId;
      this.submissions = submissions;
  }

  public String getId() {
      return id.toHexString();  // Convert the ObjectId to a string
  }

  // MongoDB will call this method to set the ID after inserting the document
  public void setId(ObjectId id) {
      this.id = id;
  }
}
