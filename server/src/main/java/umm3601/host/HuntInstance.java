package umm3601.host;
import org.bson.types.ObjectId;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Date;

public class HuntInstance {
  public ObjectId _id;
  public String huntId;
  public List<String> submissions;
  public String description;
  public String name;
  public Date creationTime;
  public int est;
  public int numberOfTasks;


    public HuntInstance(String huntId, ArrayList<String> list, LocalDateTime creationTime, String description, String name, int est, int numberOfTasks) {
    this.huntId = huntId;
    this.description = description;
    this.name = name;
    this.est = est;
    this.numberOfTasks = numberOfTasks;
    this.submissions = new ArrayList<>();
    this.creationTime = new Date();
}

  public String getHuntId() {
    return huntId;
}
public String getId() {
  ObjectId id = new ObjectId();
    return id.toHexString();
}

public List<String> getSubmissions() {
    return submissions;
}

  // MongoDB will call this method to set the ID after inserting the document
}
