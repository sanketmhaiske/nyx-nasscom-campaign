/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @next/next/no-img-element */
"use client";
import React, { useEffect, useState, useRef } from "react";
import "cropperjs/dist/cropper.css";
import Cropper from "cropperjs";
import { useMutation } from "@tanstack/react-query";
import { admanagerSystemUpload } from "@nyx-frontend/main/services/admanagerServices";
import "./crop.css";
import "swiper/css";
import Button from "@nyx-frontend/main/components/Button";
import { Slider } from "rsuite";
import "rsuite/Slider/styles/index.css";
import "rsuite/RangeSlider/styles/index.css";
import classNames from "@nyx-frontend/main/utils/classNames";

type ImageRefType = HTMLImageElement | null;

const CropImage = ({
  uploadImageUrl,
  onClose,
  imageDimensions,
  driveImageRefetch,
}: any) => {
  const imageRef = useRef<ImageRefType>(null);
  const [cropperInstance, setCropperInstance] = useState<Cropper | null>(null);
  const [data, setData] = useState<any>();

  const [cropper, setCropper] = useState<boolean>(false);
  const [cropperSecond, setCropperSecond] = useState<boolean>(false);

  const [zoomLevel, setZoomLevel] = useState(0); // Initial zoom level
  const [previousZoomLevel, setPreviousZoomLevel] = useState(0);

  const onCloseEvent = () => {
    onClose();
    driveImageRefetch();
  };

  const mutateUploadfromSyetem = useMutation({
    mutationKey: ["upload-system"],
    mutationFn: admanagerSystemUpload,
  });

  const handleCrop = () => {
    if (cropperInstance) {
      const croppedCanvas = cropperInstance.getCroppedCanvas();
      if (croppedCanvas) {
        console.log("croppedCanvas", croppedCanvas);
        croppedCanvas.toBlob((blob) => {
          // converting blob to file
          // blob.name ="abvkjg";
          // blob.lastModified = new Date();
          console.log(blob);

          if (blob) {
            // const link = document.createElement("a");
            // const url = URL.createObjectURL(blob);

            // link.href = url;
            // link.download = "cropped-image.png"; // You can set the desired filename and extension

            // Trigger the download
            // link.click();

            // Revoke the object URL to free up memory
            //URL.revokeObjectURL(url);

            const file = new File([blob], "cropped-image.png", {
              type: blob.type,
            });

            console.log("blob", blob);
            console.log("file", file);

            const workspaceId = localStorage.getItem("workspace_id");
            if (!workspaceId) {
              console.error("Workspace ID not found.");
              return;
            }

            const formData = new FormData();
            formData.append("type", "admanager");
            formData.append("workspace_id", workspaceId);
            formData.append("file", file);

            mutateUploadfromSyetem.mutate(formData, {
              onSuccess: (response: any) => {
                onCloseEvent();
                driveImageRefetch();
              },
              onError: (res: any) => {
                console.log(res);
                driveImageRefetch();
              },
            });
          }
        });
      }
    }
  };

  //Initialize cropper when image is loaded
  const initializeCropper = () => {
    setCropper(true);
    setCropperSecond(false);
    destroyCropper();
    if (imageRef.current) {
      const cropper = new Cropper(imageRef.current, {
        aspectRatio: 1 / 1,
        viewMode: 1,
        autoCropArea: 0.8,
        responsive: true,
        background: false,
        movable: true, // Prevent moving the image inside the cropper
        cropBoxMovable: true, // Disable moving the crop box
        cropBoxResizable: false,
        dragMode: "none",

        ready: () => {
          // Get the image data once the cropper is ready
          const imageData = cropper.getImageData();
          const { width, height } = imageData;

          // Calculate the minimum dimension (width or height)
          const minDimension = Math.min(width, height);

          // Set the crop box size based on the minimum dimension
          cropper.setCropBoxData({
            width: minDimension, // Set the crop box width to the minimum dimension
            height: minDimension, // Set the crop box height to the minimum dimension
          });
        },
      });

      setCropperInstance(cropper);
    }
  };

  const initializeCropperSecond = () => {
    setCropper(false);
    setCropperSecond(true);
    destroyCropper();
    if (imageRef.current) {
      const cropper = new Cropper(imageRef.current, {
        aspectRatio: 1.91 / 1,
        viewMode: 1,
        autoCropArea: 0.8,
        responsive: true,
        background: false,
        movable: true, // Prevent moving the image inside the cropper
        cropBoxMovable: true, // Disable moving the crop box
        cropBoxResizable: false,
        dragMode: "none",

        ready: () => {
          // Get the image data once the cropper is ready
          const imageData = cropper.getImageData();
          const { width, height } = imageData;

          // Calculate the minimum dimension (width or height)
          const minDimension = Math.min(width, height);

          // Set the crop box size based on the minimum dimension
          cropper.setCropBoxData({
            width: minDimension, // Set the crop box width to the minimum dimension
            height: minDimension, // Set the crop box height to the minimum dimension
          });
        },
      });

      setCropperInstance(cropper);
    }
  };

  // Cleanup cropper instance
  const destroyCropper = () => {
    if (cropperInstance) {
      cropperInstance.destroy();
      setCropperInstance(null);
    }
  };

  useEffect(() => {
    setData(uploadImageUrl);
  }, [uploadImageUrl]);

  useEffect(() => {
    if (data) {
      const img = imageRef.current;
      if (img) {
        initializeCropper();
      }
    }
    return () => {
      destroyCropper();
    };
  }, [data]);

  const handleZoomChange = (newZoomLevel:any) => {
    // Set zoom directly based on slider position
    cropperInstance?.zoomTo(newZoomLevel); 
    // Update the zoom level states
    setZoomLevel(newZoomLevel);
  };
  return (
    <>
      <div className="fixed inset-0 m-auto bg-black/50 z-40"></div>
      <div className="fixed z-50 inset-0 m-auto flex justify-center items-end md:items-center">
        <div className="w-full md:w-[639px] overflow-auto rounded-lg bg-[#3B226F] py-8 px-5">
          <div className="flex flex-row w-full justify-end relative">
            <button
              className="px-2 py-1 absolute -top-4 -right-4"
              onClick={onCloseEvent}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                viewBox="0 0 14 14"
                fill="none"
              >
                <path
                  d="M0.35 13.65C0.583333 13.8833 0.855555 14 1.16667 14C1.47778 14 1.75 13.8833 1.98333 13.65L7 8.63333L12.0556 13.6889C12.263 13.8963 12.5287 13.9935 12.8528 13.9806C13.1769 13.9676 13.4426 13.8574 13.65 13.65C13.8833 13.4167 14 13.1444 14 12.8333C14 12.5222 13.8833 12.25 13.65 12.0167L8.63333 7L13.6889 1.94444C13.8963 1.73704 13.9935 1.4713 13.9806 1.14722C13.9676 0.823148 13.8574 0.557407 13.65 0.35C13.4167 0.116667 13.1444 0 12.8333 0C12.5222 0 12.25 0.116667 12.0167 0.35L7 5.36667L1.94444 0.311111C1.73704 0.103703 1.4713 0.00648092 1.14722 0.0194439C0.823148 0.0324068 0.557407 0.142593 0.35 0.35C0.116667 0.583333 0 0.855555 0 1.16667C0 1.47778 0.116667 1.75 0.35 1.98333L5.36667 7L0.311111 12.0556C0.103703 12.263 0.00648092 12.5287 0.0194439 12.8528C0.0324068 13.1769 0.142593 13.4426 0.35 13.65Z"
                  fill="white"
                />
              </svg>
            </button>
          </div>

          <div className="w-full flex justify-between">
            <div className="text-white w-full text-base md:text-lg font-semibold">
              Crop
            </div>
          </div>

          <div className="w-full">
            <div className="w-full flex justify-center h-[300px]">
              <img
                ref={imageRef}
                id="image"
                src={uploadImageUrl}
                alt="Source"
                style={{
                  maxWidth: "auto", // Makes sure image doesn't exceed 90% of container width
                  maxHeight: "100%", // Ensures image is contained within the viewport height
                  // objectFit: "contain", // Ensures the image scales without distortion
                }}
              />
            </div>
          </div>

          <div className="flex justify-center items-center mt-[16px]">
            <button
              onClick={() => initializeCropper()} // Zoom In
              type="button"
              //className="cursor-pointer bg-transparent border border-nyx-yellow text-white font-semibold w-[80px] h-[35px] rounded-tl-md rounded-bl-md text-[14px] hover:shadow-color-purple focus:outline-white"
              className={classNames(
                "cursor-pointer border border-nyx-yellow font-semibold w-[80px] h-[35px] rounded-tl-md rounded-bl-md text-[14px] hover:shadow-color-purple focus:outline-white",
                cropper
                  ? " bg-nyx-yellow text-black"
                  : "bg-transparent text-white",
              )}
            >
              1:1
            </button>
            <button
              onClick={() => initializeCropperSecond()} // Zoom Out
              type="button"
              //className="cursor-pointer bg-transparent border border-nyx-yellow text-white font-semibold w-[80px] h-[35px] rounded-tr-md rounded-br-md text-[14px] hover:shadow-color-purple focus:outline-white"
              className={classNames(
                "cursor-pointer border border-nyx-yellow font-semibold w-[80px] h-[35px] rounded-tr-md rounded-br-md text-[14px] hover:shadow-color-purple focus:outline-white",
                cropperSecond
                  ? " bg-nyx-yellow text-black"
                  : "bg-transparent text-white",
              )}
            >
              1.91:1
            </button>
            {/* <button
              onClick={() => cropperInstance?.zoom(0.1)} // Zoom In
              type="button"
              className="cursor-pointer bg-nyx-yellow text-black font-semibold w-[110px] h-[34px] text-[14px] rounded-[30px] hover:shadow-color-purple focus:outline-white"
            >
              Zoom In
            </button>
            <button
              onClick={() => cropperInstance?.zoom(-0.1)} // Zoom Out
              type="button"
              className="cursor-pointer bg-nyx-yellow text-black font-semibold w-[110px] h-[34px] text-[14px] rounded-[30px] hover:shadow-color-purple focus:outline-white"
            >
              Zoom Out
            </button> */}
          </div>

          <div className="w-full my-2 flex gap-2 justify-center items-center">
            <svg
              width="25"
              height="24"
              viewBox="0 0 25 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M11.7966 14.8393C8.96852 15.6503 6.01867 14.0151 5.20774 11.1871C4.3968 8.35914 6.03199 5.4093 8.85996 4.59836C11.6879 3.78742 14.6378 5.42261 15.4487 8.25058C15.8628 9.69461 15.2671 11.8133 14.5724 13.0198C14.5149 13.1199 20.1236 17.9946 20.1236 17.9946L18.4898 19.6474L13.4728 14.3299C13.4728 14.3299 12.5135 14.6337 11.7966 14.8393ZM10.2535 13.4996C12.3245 13.4996 14.0035 11.8207 14.0035 9.74964C14.0035 7.67861 12.3245 5.99964 10.2535 5.99964C8.18242 5.99964 6.50346 7.67861 6.50346 9.74964C6.50346 11.8207 8.18242 13.4996 10.2535 13.4996Z"
                fill="white"
              />
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M8 9.00781V10.5071H12.5V9.00781H8Z"
                fill="white"
              />
            </svg>

            <Slider
              tooltip={false}
              progress
              min={0}
              max={10} // Maximum zoom level (adjust as needed)
              value={zoomLevel}
              step={0.1} // Zoom increments
              onChange={handleZoomChange}
              className="w-[50%] crop-zoom"
            />

            <svg
              width="25"
              height="24"
              viewBox="0 0 25 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M11.7966 14.8393C8.96852 15.6503 6.01867 14.0151 5.20774 11.1871C4.3968 8.35914 6.03199 5.4093 8.85996 4.59836C11.6879 3.78742 14.6378 5.42261 15.4487 8.25058C15.8628 9.69461 15.2671 11.8133 14.5724 13.0198C14.5149 13.1199 20.1236 17.9946 20.1236 17.9946L18.4898 19.6474L13.4728 14.3299C13.4728 14.3299 12.5135 14.6337 11.7966 14.8393ZM10.2535 13.4996C12.3245 13.4996 14.0035 11.8207 14.0035 9.74964C14.0035 7.67861 12.3245 5.99964 10.2535 5.99964C8.18242 5.99964 6.50346 7.67861 6.50346 9.74964C6.50346 11.8207 8.18242 13.4996 10.2535 13.4996Z"
                fill="white"
              />
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M10.9918 7.50391H9.49644V9.00738H8V10.5066H9.49644V11.9995H10.9918V10.5066H12.5V9.00738H10.9918V7.50391Z"
                fill="white"
              />
            </svg>
          </div>

          <div className="w-full flex justify-center items-center gap-4 mt-[16px]">
            <Button
              className="w-[136px] rounded-full text-nyx-yellow hover:shadow-none font-semibold"
              onClick={onCloseEvent}
            >
              Back
            </Button>
            <Button
              //className="w-[136px] rounded-full text-nyx-yellow hover:shadow-none font-semibold"
              className={classNames(
                "rounded-full w-44 font-semibold text-black",

                mutateUploadfromSyetem.isPending
                  ? " w-[136px] bg-gray-400 cursor-not-allowed border border-gray-400 hover:bg-gray-400 hover:shadow-none"
                  : "w-[136px] bg-nyx-yellow hover:shadow-none text-black",
              )}
              onClick={handleCrop}
              type="submit"
            >
              {mutateUploadfromSyetem.isPending ? (
                <svg
                  width="25"
                  height="25"
                  className="inline text-gray-200 text-center animate-spin dark:text-transparent"
                  viewBox="0 0 25 25"
                  fill="black"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M12 22.5C10.6333 22.5 9.34167 22.2375 8.125 21.7125C6.90833 21.1875 5.84583 20.4708 4.9375 19.5625C4.02917 18.6542 3.3125 17.5917 2.7875 16.375C2.2625 15.1583 2 13.8667 2 12.5C2 11.1167 2.2625 9.82083 2.7875 8.6125C3.3125 7.40417 4.02917 6.34583 4.9375 5.4375C5.84583 4.52917 6.90833 3.8125 8.125 3.2875C9.34167 2.7625 10.6333 2.5 12 2.5C12.2833 2.5 12.5208 2.59583 12.7125 2.7875C12.9042 2.97917 13 3.21667 13 3.5C13 3.78333 12.9042 4.02083 12.7125 4.2125C12.5208 4.40417 12.2833 4.5 12 4.5C9.78333 4.5 7.89583 5.27917 6.3375 6.8375C4.77917 8.39583 4 10.2833 4 12.5C4 14.7167 4.77917 16.6042 6.3375 18.1625C7.89583 19.7208 9.78333 20.5 12 20.5C14.2167 20.5 16.1042 19.7208 17.6625 18.1625C19.2208 16.6042 20 14.7167 20 12.5C20 12.2167 20.0958 11.9792 20.2875 11.7875C20.4792 11.5958 20.7167 11.5 21 11.5C21.2833 11.5 21.5208 11.5958 21.7125 11.7875C21.9042 11.9792 22 12.2167 22 12.5C22 13.8667 21.7375 15.1583 21.2125 16.375C20.6875 17.5917 19.9708 18.6542 19.0625 19.5625C18.1542 20.4708 17.0958 21.1875 15.8875 21.7125C14.6792 22.2375 13.3833 22.5 12 22.5Z" />
                </svg>
              ) : (
                "Save"
              )}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default CropImage;
