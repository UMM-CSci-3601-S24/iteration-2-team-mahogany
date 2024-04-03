// FILEPATH: /home/mahon480/Downloads/iteration-2-team-mahogany/server/src/test/java/umm3601/host/FileFactoryTest.java
package umm3601.host;

import org.junit.jupiter.api.Test;
import org.mockito.Mockito;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.io.File;

public class FileFactoryTest {

    @Test
    public void testCreate() {
        // Create a mock FileFactory
        FileFactory fileFactory = Mockito.mock(FileFactory.class);

        // Define the behavior for the mock when the create method is called
        when(fileFactory.create(anyString())).thenReturn(new File("path/to/file"));

        // Call the create method on the mock
        File file = fileFactory.create("path/to/file");

        // Verify that the create method was called with the correct parameter
        verify(fileFactory, times(1)).create("path/to/file");

        // Assert that the returned File has the correct path
        assertEquals("path/to/file", file.getPath());
    }
}
