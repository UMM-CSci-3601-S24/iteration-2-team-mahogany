package umm3601.host;

import org.mongojack.Id;
import org.mongojack.ObjectId;

@SuppressWarnings({"VisibilityModifier"})
public class Hunt {

    @ObjectId @Id
    @SuppressWarnings({"MemberName"})
    public String _id;

    public String hostId;

    public String name;
    public String description;
    public int est;
    public int numberOfTasks;


    public String getName() {
      return this.name;
  }

  public String getDescription() {
    return this.description;

  }

  public int getEst() {
    return this.est;
  }

  public int getNumberOfTasks() {
    return this.numberOfTasks;
  }

  
}
