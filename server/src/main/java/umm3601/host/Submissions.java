package umm3601.host;

public class Submissions {
  @ObjectId @Id
  @SuppressWarnings({"MemberName"})
  public String _id;

  public String huntInstanceId;
  public String name;
  public boolean status;

  public String getId() {
      return this._id;
  }
}
