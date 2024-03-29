package umm3601.host;
import org.bson.types.ObjectId;

import java.util.ArrayList;
import java.util.List;

public class HuntInstance {
  private ObjectId id;  // instance variable
  private ObjectId huntId;
  private ArrayList<Task> submissions;

  public HuntInstance(ObjectId huntId, ArrayList<Task> submissions) {
      this.huntId = huntId;
      this.submissions = submissions;
  }

  public String getId() {
      return id != null ? id.toHexString() : null;
  }

  // MongoDB will call this method to set the ID after inserting the document
  public void setId(ObjectId id) {
      this.id = id;
  }
}
