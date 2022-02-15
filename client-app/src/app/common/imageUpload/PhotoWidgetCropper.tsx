import React from "react";
import { Cropper } from "react-cropper";
import "cropperjs/dist/cropper.css";

interface Props {
  imagePreview: string;
  setCropper: (cropper: Cropper) => void;
}

function PhotosWidgetCropper({setCropper, imagePreview}: Props) {  
  return (
    <Cropper 
      src={imagePreview}
      style={{height: "200px", width: "100%"}}
      initialAspectRatio={1}
      aspectRatio={1}
      preview=".img-preview"
      guides={false}
      viewMode={1}
      autoCropArea={1}
      background={false}
      onInitialized={setCropper}
    />
  );
}

export default PhotosWidgetCropper;