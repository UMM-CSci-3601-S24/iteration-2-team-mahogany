package umm3601.host;

import java.util.Date;

import org.mongojack.Id;
import org.mongojack.ObjectId;

@SuppressWarnings({"VisibilityModifier"})
public class HuntInstances {
  @ObjectId @Id
  @SuppressWarnings({"MemberName"})
  public String _id;
  public String huntId;
  public Date start_time;
  public Date end_time;
}

/*
 * Hit start hunt ->
 * Method takes hunt profile -> create new hunt in (StartedHunts) Clone all existing data -> view started hunt with new hunt data???
 */
