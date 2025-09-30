/* eslint-disable @next/next/no-img-element */
"use client";
import React, { useEffect, useState, useContext, useRef } from "react";
import type { UploadAdManagerProps } from "@/types/AnalysisLoading.types";
// import CropImage from "@/components/CropImage";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// import "@nyx-frontend/main/app/_components/toastifyTest/toastify.css";
import { useQuery, useMutation } from "@tanstack/react-query";
import {
  getBrandCanvasAssets,
  getAssetImage,
} from "@/services/asset";
import classNames from "@/utils/classNames";
import { nanoid } from "nanoid";
// import { MessagePopupContext } from "@/hooks/MessagePopupContext";
import Button from "@/components/ui/Button2";
import { creativeDummydata } from "@/data/CreativeDummyData";

const UploadAdCreative = ({
  onClose = () => { },
  driveClickedArray,
  setDriveClickedArray,
  targetGroup,
  position,
}: UploadAdManagerProps = {}) => {
  const onCloseEvent = () => {
    onClose();
  };

  // const { displayMessagePopup } = useContext<any>(MessagePopupContext);
  const imageUploadRef = useRef<any>(null);
  const [uploadImageUrl, setUploadImageUrl] = useState<string | null>(null);
  const [cropPopUp, setCropPopUp] = useState<boolean>(false);
  const [imageDimensions, setImageDimensions] = useState<{
    width: number;
    height: number;
  } | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const {
    data,
    isSuccess,
    isPending: driveImagePending,
    refetch: driveImageRefetch,
  } = useQuery({
    queryKey: ["drive-data-admanager"],
    queryFn: async () => {
      const res = await getAssetImage(localStorage.getItem("workspace_id"));
      return res;
    },
  });

  function truncateFileName(imageName: string) {
    // Extract the first 5-6 characters (you can adjust the length here)
    const truncatedName = imageName.substring(0, 6);
    // Append the .png extension
    return `${truncatedName}.png`;
  }

  const handleSystemImageUploadClick = () => {
    if (imageUploadRef.current) {
      imageUploadRef.current?.click();
    }
  };

  const systemUploadImage = (event: React.ChangeEvent<HTMLInputElement>) => {
    const mediaFile = event.target.files?.[0];

    if (!mediaFile) {
      console.error("No file selected.");
      return;
    }

    const imageUrl = URL.createObjectURL(mediaFile);
    setUploadImageUrl(imageUrl);

    const img = new Image();
    img.src = imageUrl;

    img.onload = () => {
      const width = img.width;
      const height = img.height;

      if (width >= 600 && height >= 600) {
        setImageDimensions({ width, height });
        setCropPopUp(true);
        setErrorMessage(null);
      } else {
        setCropPopUp(false);
        setErrorMessage("Image dimensions must be at least 600x600 pixels.");
        toast.error(
          <>
            <span className="text-white text-[16px] leading-[20px]">
              {" "}
              Invalid Image!
            </span>
            <br />
            <span className="text-white text-[12px] leading-[18px] truncate2lines mt-2">
              {" "}
              Image dimensions must be at least 600x600 pixels.
            </span>
          </>,
          { autoClose: 5000 }
        );
      }

      console.log(`Image Width: ${width}, Image Height: ${height}`);
    };
  };
  const closeCropPopup = () => {
    setCropPopUp(false);
  };

  const convertFileSizeToBytes = (sizeStr: string): number => {
    const units = {
      B: 1,
      KB: 1024,
      MB: 1024 * 1024,
      Mb: 8 * 1024 * 1024,
      GB: 1024 * 1024 * 1024,
    };

    const match = sizeStr.match(/^(\d+(?:\.\d+)?)\s*(B|KB|MB|GB|Mb)$/i);
    if (match) {
      const value = parseFloat(match[1]);
      const unit = match[2].toUpperCase() as keyof typeof units;
      return value * units[unit];
    }

    throw new Error("Invalid file size format.");
  };

  const getAspectRatio = (
    url: string
  ): Promise<{ aspectRatio: string; width: number; height: number }> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        const width = img.width;
        const height = img.height;
        const aspectRatio = `${(width / height).toFixed(2)}:1`; // Simplify the ratio
        resolve({ aspectRatio, width, height });
      };
      img.onerror = (err) => reject(err);
      img.src = url;
    });
  };

  const isEqual = (a: any, b: any) => {
    return (
      a.name === b.name &&
      a.type === b.type &&
      a.signed_image_url === b.signed_image_url
    );
  };

  const driveFileSelected = async (data: any, index: any) => {
    try {
      const fileSizeStr = data?.size; // e.g., "10MB"
      const fileSizeInBytes = convertFileSizeToBytes(fileSizeStr);

      //console.log(fileSizeInBytes);

      if (fileSizeInBytes <= 30 * 1024 * 1024) {
        const imageData = await getAspectRatio(
          data?.file_details?.signed_image_url
        );

        if (imageData?.width == imageData?.height) {
          if (
            imageData?.aspectRatio === "1.00:1" &&
            imageData?.width >= 600 &&
            imageData?.height >= 600
          ) {
            setDriveClickedArray((clickedData: any) => {
              const newItem = {
                id: nanoid(),
                targetGroup: targetGroup,
                file_id: data?.file_id,
                name: data?.name,
                type: "images",
                signed_image_url: data?.file_details?.signed_image_url,
                ratio: imageData?.aspectRatio, // Add aspect ratio here
              };

              if (clickedData?.some((item: any) => isEqual(item, newItem))) {
                return clickedData.filter(
                  (item: any) => !isEqual(item, newItem)
                );
              } else {
                return [...clickedData, newItem];
              }
            });
          } else {
            // displayMessagePopup(
            //   "handle-input-prod-logo",
            //   "error",
            //   "Error",
            //   "For Square Image Minimum width is 600 pixels Minimum height is 600 pixels Aspect Ratio is 1:1"
            // );
          }
        } else {
          if (
            imageData?.aspectRatio === "1.91:1" &&
            imageData?.width >= 600 &&
            imageData?.height >= 314
          ) {
            setDriveClickedArray((clickedData: any) => {
              const newItem = {
                id: nanoid(),
                targetGroup: targetGroup,
                file_id: data?.file_id,
                name: data?.name,
                type: "images",
                signed_image_url: data?.file_details?.signed_image_url,
                ratio: imageData?.aspectRatio, // Add aspect ratio here
              };

              if (clickedData?.some((item: any) => isEqual(item, newItem))) {
                return clickedData.filter(
                  (item: any) => !isEqual(item, newItem)
                );
              } else {
                return [...clickedData, newItem];
              }
            });
          } else {
            // displayMessagePopup(
            //   "handle-input-prod-logo",
            //   "error",
            //   "Error",
            //   "For LandScape Image Minimum width is 600 pixels Minimum height is 314 pixels Aspect Ratio is 1.91:1"
            // );
          }
        }
      } else {
        // displayMessagePopup(
        //   "handle-input-prod-logo",
        //   "error",
        //   "Error",
        //   "File size exceeds the maximum limit of 30MB."
        // );
      }
    } catch (err) {
      console.error("Error loading image for aspect ratio calculation", err);
    }
  };

  return (
    <>
      <div className={`${position === 'relative' ? 'relative' : 'fixed'} inset-0 m-auto bg-black/50 z-40`}></div>
      <div className={`${position === 'relative' ? 'relative' : 'fixed'} z-50 inset-0 m-auto flex justify-center items-end md:items-center max-w-[500px]`}>
        <div className="w-full md:w-[639px] rounded-lg bg-[#332270] py-8 px-5">
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
              Upload your Creative
            </div>

            <button
              className="flex items-center gap-1 text-white hover:text-nyx-yellow"
              onClick={handleSystemImageUploadClick}
            >
              <input
                ref={imageUploadRef}
                type="file"
                className="w-full h-full pointer-events-none text-white bg-gray-100 border-white mr-2 opacity-0 absolute"
                name="uploadProcess"
                accept=".jpg, .jpeg, .png"
                onChange={systemUploadImage}
              />

              <svg
                width="16"
                height="14"
                viewBox="0 0 16 14"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M0.164062 0.332031H14.8307V2.9987H13.4974V1.66536H1.4974V10.332H7.4974V11.6654H0.164062V0.332031ZM8.83073 4.33203H15.4974V13.6654H8.83073V4.33203ZM10.1641 5.66536V12.332H14.1641V5.66536H10.1641ZM11.4961 10.3307H12.8321V11.6667H11.4961V10.3307ZM2.83073 12.332H7.4974V13.6654H2.83073V12.332Z"
                  fill="currentColor"
                />
              </svg>

              <p className="underline text-[12px] leading-[17px] font-medium min-w-[140px] text-left">
                Browse from System
              </p>
            </button>
          </div>

          <div className="w-full">
            {driveImagePending ? (
              <svg
                width="25"
                height="25"
                className="inline text-gray-200 text-center animate-spin dark:text-transparent"
                viewBox="0 0 25 25"
                fill="white"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M12 22.5C10.6333 22.5 9.34167 22.2375 8.125 21.7125C6.90833 21.1875 5.84583 20.4708 4.9375 19.5625C4.02917 18.6542 3.3125 17.5917 2.7875 16.375C2.2625 15.1583 2 13.8667 2 12.5C2 11.1167 2.2625 9.82083 2.7875 8.6125C3.3125 7.40417 4.02917 6.34583 4.9375 5.4375C5.84583 4.52917 6.90833 3.8125 8.125 3.2875C9.34167 2.7625 10.6333 2.5 12 2.5C12.2833 2.5 12.5208 2.59583 12.7125 2.7875C12.9042 2.97917 13 3.21667 13 3.5C13 3.78333 12.9042 4.02083 12.7125 4.2125C12.5208 4.40417 12.2833 4.5 12 4.5C9.78333 4.5 7.89583 5.27917 6.3375 6.8375C4.77917 8.39583 4 10.2833 4 12.5C4 14.7167 4.77917 16.6042 6.3375 18.1625C7.89583 19.7208 9.78333 20.5 12 20.5C14.2167 20.5 16.1042 19.7208 17.6625 18.1625C19.2208 16.6042 20 14.7167 20 12.5C20 12.2167 20.0958 11.9792 20.2875 11.7875C20.4792 11.5958 20.7167 11.5 21 11.5C21.2833 11.5 21.5208 11.5958 21.7125 11.7875C21.9042 11.9792 22 12.2167 22 12.5C22 13.8667 21.7375 15.1583 21.2125 16.375C20.6875 17.5917 19.9708 18.6542 19.0625 19.5625C18.1542 20.4708 17.0958 21.1875 15.8875 21.7125C14.6792 22.2375 13.3833 22.5 12 22.5Z" />
              </svg>
            ) : null}

            <div
              className={`flex flex-wrap gap-6 my-3 overflow-y-auto overflow-x-hidden  ${isSuccess
                  ? "bg-[#23145A] rounded-md h-[300px] p-4"
                  : "bg-[#23145A] rounded-md h-[50px] px-4 pt-2"
                }`}
            >
              <>
                {creativeDummydata?.filter((item: any) => item.type === "Images")
                  .length > 0 ? (
                  creativeDummydata
                    ?.filter((item: any) => item.type === "Images")
                    .map((item: any, index: any) => {
                      const isSelectedImage = driveClickedArray.some(
                        (clickedItem: any) =>
                          clickedItem?.signed_image_url ===
                          item?.file_details?.signed_image_url
                      );

                      const { width, height, aspectRatio } = item.file_details;
                      const isPerfectImage =
                        (width >= 600 &&
                          height >= 314 &&
                          aspectRatio == 1.91) ||
                        (width >= 600 && height >= 600 && aspectRatio == 1.0);

                      return isPerfectImage ? (
                        <div
                          key={index}
                          className={classNames(
                            `relative w-[120px] h-[120px] py-2 rounded-md flex flex-col items-center hover:border-[#5E32FF] border-transparent border-2 cursor-pointer p-2`,
                            {
                              "bg-[#5E32FF]": isSelectedImage,
                              "bg-transparent": !isSelectedImage,
                            }
                          )}
                          onClick={() => driveFileSelected(item, index)}
                        >
                          <div className="absolute right-[10px] top-[0px]">
                            <input
                              type="checkbox"
                              id=""
                              checked={isSelectedImage} // Automatically checked if the image is selected
                              onChange={() => driveFileSelected(item, index)} // Optional: Link to the image selection logic
                              className="custom-checkbox "
                            />
                          </div>
                          <img
                            className="w-full h-[85%] object-contain"
                            src={item?.file_details?.signed_image_url}
                            alt="AI Generated Image"
                            decoding="async"
                            loading="lazy"
                          />
                          <div>
                            <p className="text-white text-[14px] leading-[19px] pt-1">
                              {`${truncateFileName(item?.name)}`}
                            </p>
                          </div>
                          <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col items-center justify-center text-white text-sm font-bold opacity-0 hover:opacity-100 rounded-md">
                            <p>
                              {width} x {height}
                            </p>
                            <p>
                              {aspectRatio == 1.0
                                ? "1 : 1"
                                : `${aspectRatio} : 1`}
                            </p>
                          </div>
                        </div>
                      ) : (
                        <div
                          key={index}
                          className="relative w-[120px] h-[120px] py-2 rounded-md flex flex-col items-center border-transparent border-2 p-2 cursor-not-allowed bg-gray-600 bg-opacity-50"
                        >
                          <img
                            className="w-full h-[85%] object-contain opacity-40"
                            src={item?.file_details?.signed_image_url}
                            alt="AI Generated Image"
                            decoding="async"
                            loading="lazy"
                          />
                          <div>
                            <p className="text-white text-[14px] leading-[19px] pt-1">
                              {`${truncateFileName(item?.name)}`}
                            </p>
                          </div>

                          <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col items-center justify-center text-white text-sm font-bold opacity-0 hover:opacity-100 rounded-md">
                            <p>
                              {width} x {height}
                            </p>
                            <p>
                              {aspectRatio == 1.0
                                ? "1 : 1"
                                : `${aspectRatio} : 1`}
                            </p>
                          </div>
                        </div>
                      );
                    })
                ) : (
                  <div className="text-center text-white">
                    No images available
                  </div>
                )}
              </>
            </div>

            <div className="w-full flex gap-4 items-center justify-center mt-6">
              <Button
                className="w-[136px] rounded-full  text-nyx-yellow hover:shadow-none font-semibold"
                onClick={onCloseEvent}
              >
                Back
              </Button>
              <Button
                //className="w-[136px] rounded-full  text-nyx-yellow hover:shadow-none font-semibold"
                className={classNames(
                  "rounded-full w-44 font-semibold text-black",

                  driveClickedArray.length == 0
                    ? " w-[136px] bg-gray-400 cursor-not-allowed border border-gray-400 hover:bg-gray-400 hover:shadow-none"
                    : "w-[136px] bg-nyx-yellow hover:shadow-none text-white"
                )}
                onClick={onCloseEvent}
                disabled={driveClickedArray.length == 0}
              >
                Select
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* {cropPopUp ? (
        <CropImage
          uploadImageUrl={uploadImageUrl}
          imageDimensions={imageDimensions}
          onClose={closeCropPopup}
          driveImageRefetch={driveImageRefetch}
        />
      ) : null} */}
    </>
  );
};

export default UploadAdCreative;
