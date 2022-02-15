import React, { useEffect, useState } from "react";
import { Button, Grid, Header } from "semantic-ui-react";
import { Cropper } from "react-cropper";
import PhotoWidgetDropzone from "./PhotoWidgetDropzone";
import PhotoWidgetCropper from "./PhotoWidgetCropper";
import { PhotoUploadFile } from "./photoUploadFile";

interface Props {
  uploadPhoto: (file:Blob) => void;
  loading: boolean;
}

function PhotosUploadWidget({ uploadPhoto, loading}: Props) {  

  const [files, setFiles] = useState<PhotoUploadFile[]>([]);
  const [cropper, setCropper] = useState<Cropper>();

  //cleanup on component disposal
  useEffect(() => {
    return () => {
      //console.log("Revoke");
      files.forEach( file => URL.revokeObjectURL(file.preview!))
    }
  }, [files]);

  const onSetFiles = (images:any[]) => {
    setFiles(images);
  }

  const onSetCropper = (cropper: Cropper) => {
    //console.log("Set Cropper");
    setCropper(cropper);
  }  

  const onCrop = () => {
    if(cropper) {
      cropper.getCroppedCanvas().toBlob(blob => {
        if(blob) uploadPhoto(blob);
      })
    }
  }

  //console.log("PUW");

  return (
    <Grid>
      <Grid.Column width={4}>
        <Header sub color="teal" content="Step 1 - Add Photo"/>
        <PhotoWidgetDropzone setFiles={onSetFiles}/>
      </Grid.Column>  
      <Grid.Column width={1}/>
      <Grid.Column width={4}>
        <Header sub color="teal" content="Step 2 - Resize Image"/>
        {files && files.length>0 && (
          <PhotoWidgetCropper setCropper={onSetCropper} imagePreview={files[0].preview!}/>
        )}
      </Grid.Column>        
      <Grid.Column width={1}/>
      <Grid.Column width={4}>  
        <Header sub color="teal" content="Step 3 - Preview & Upload"/>
        {files && files.length>0 &&
        (<>
          <div className="img-preview" style={{minHeight: "200px", overflow: "hidden"}} />
          <Button.Group width={2}>
            <Button loading={loading} onClick={onCrop} positive icon="check"/>
            <Button disabled={loading} onClick={() => setFiles([])} icon="close"/>
          </Button.Group>
        </>)}
      </Grid.Column>        
    </Grid>
  )
}


export default PhotosUploadWidget;