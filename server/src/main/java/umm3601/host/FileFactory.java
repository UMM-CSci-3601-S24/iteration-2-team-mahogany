package umm3601.host;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;

public interface FileFactory {
  File create(String path);

  FileInputStream createInputStream(File file) throws FileNotFoundException;
}
