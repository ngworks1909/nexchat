import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage } from "./firebase";

const getFilePath = (file: File) => {
    if (file.type.startsWith("image/")) {
      return "images";
    } else if (file.type.startsWith("video/")) {
      return "videos";
    } else if (file.type.startsWith("audio/")) {
      return "audios";
    }
    return "others";
};

export const uploadFile = async(file: File) => {
    try {
        const storageRef = ref(storage, `${getFilePath(file)}`);
        if(file){
            await uploadBytesResumable(storageRef, file);
            const url = await getDownloadURL(storageRef)
            return url
        }
        return ""
    } catch (error) {
        console.log(error)
        return ""
    }
}