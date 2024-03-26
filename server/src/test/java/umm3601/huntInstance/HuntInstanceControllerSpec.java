package umm3601.huntInstance;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;

import org.junit.jupiter.api.Test;
import org.mockito.Mockito;

import io.javalin.Javalin;

public class HuntInstanceControllerSpec {

    @Test
  void addRoutes() {
    Javalin mockServer = mock(Javalin.class);
    HuntInstanceController.addRoutes(mockServer);
    verify(mockServer, Mockito.atLeast(1)).get(any(), any());
  }

}
