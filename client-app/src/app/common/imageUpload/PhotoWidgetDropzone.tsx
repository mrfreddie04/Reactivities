import React, {useCallback} from 'react';
import {useDropzone} from 'react-dropzone';
import { Header, Icon } from 'semantic-ui-react';
import { PhotoUploadFile } from "./photoUploadFile";

interface Props {
  setFiles: (files: any[]) => void;
}

function PhotoWidgetDropzone({setFiles}: Props) {
  const dzStyles = {
    border: "dashed 3px #eee",
    borderColor: "#eee",
    borderRadius: "5px",
    paddingTop: "30px",
    textAlign: "center" as "center",
    height: "200px"
  };

  const dzActive = {
    borderColor: "green"
  };  

  // onDrop?: <T extends File>(
  //   acceptedFiles: T[],
  //   fileRejections: FileRejection[],
  //   event: DropEvent
  // ) => void;

  const onDrop = useCallback( (acceptedFiles: PhotoUploadFile[]) => {
    setFiles(acceptedFiles.map((file: any) => Object.assign(file, {preview: URL.createObjectURL(file) })));
  }, [setFiles]);
  const {getRootProps, getInputProps, isDragActive} = useDropzone({onDrop});

  return (
    <div {...getRootProps()} style={isDragActive ? {...dzStyles, ...dzActive} : dzStyles}>
      <input {...getInputProps()} />
      <Icon name="upload" size="huge" />
      <Header content="Drop image here" />
    </div>
  )
}

export default PhotoWidgetDropzone;