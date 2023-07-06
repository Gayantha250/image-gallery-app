package lk.ijse.dep10.gallery.api;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;

import org.springframework.web.bind.annotation.*;
import org.springframework.web.util.UriComponentsBuilder;
import  javax.servlet.http.Part;
import javax.servlet.ServletContext;
import javax.servlet.http.HttpServletRequest;
import java.io.File;
import java.io.IOException;
import java.lang.reflect.Array;
import java.util.ArrayList;
import java.util.List;

@RestController
@CrossOrigin
@RequestMapping("/images")
public class ImageController {

    @Autowired
    private ServletContext servletContext;
@GetMapping
    public List<String> getAllImages(UriComponentsBuilder uriBuilder){
        ArrayList<String> imageFileList=new ArrayList<>();
    String imgDirectParth = servletContext.getRealPath("/images");
    File filePath = new File(imgDirectParth);
    String[] fileNames = filePath.list();

    for (String imgfileName : fileNames) {
        UriComponentsBuilder cloneBuilder = uriBuilder.cloneBuilder();
        String url = cloneBuilder.pathSegment("images", imgfileName).toUriString();
        imageFileList.add(url);
    }
    return  imageFileList;
    }
    @ResponseStatus(HttpStatus.CREATED)
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
public List<String> saveImages(@RequestPart("abcs") List<Part> imageFiles, UriComponentsBuilder urlBuilder){ //  abcs= key value to access
  ArrayList<String> imageUrlList=new ArrayList<>();

  if(imageFiles!=null) {
      String imgDirectParth = servletContext.getRealPath("/images");
      for (Part imageFile : imageFiles) {
          String imageFilePath = new File(imgDirectParth, imageFile.getSubmittedFileName()).getAbsolutePath();
          try {
              imageFile.write(imageFilePath);
              UriComponentsBuilder cloneBuilder = urlBuilder.cloneBuilder();
              String imageUrl = cloneBuilder.
                      pathSegment("images", imageFile.getSubmittedFileName()).toUriString();//images== place where image store
              imageUrlList.add(imageUrl);
          } catch (IOException e) {

              e.printStackTrace();
          }

      }
  }
        return imageUrlList;

}


}
