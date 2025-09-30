import axios from "axios";
import { apiAxios2WithToken } from "./api";

export const getFolderForAsset = async (workspaceID: any) => {
  const res = await apiAxios2WithToken.get(
    `/assets/get-all-folders/${workspaceID}`,
  );
  return res?.data;
};
export const getAssetMedia = async (folderId: any, workspaceID: any,page:number) => {
  const res = await apiAxios2WithToken.get(
    `/assets/get-folder-files/${folderId}?workspace_id=${workspaceID}&page=${page}&limit=8`,
  );
  return res?.data;
};

export const getBrandCanvasAssets = async (workspaceID: any) => {
  const res = await apiAxios2WithToken.get(`/brand/get-media/${workspaceID}`);
  return res?.data;
};

export const editBrandCanvasAssets = async (data: object) => {
  const res = await apiAxios2WithToken.post(`/assets/rename-delete-file`, data);
  return res?.data;
};

export const favouriteAsset = async (data: object) => {
  const res = await apiAxios2WithToken.post(`/assets/set-favourite`, data);
  return res?.data;
};

export const getAssetImage = async (workspaceID: any) => {
  const res = await apiAxios2WithToken.get(
    `/assets/get-folder-files/Images?workspace_id=${workspaceID}`,
  );
  return res?.data;
};
