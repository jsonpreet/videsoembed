import { APP, BASE_NODE_URI, BASE_URI } from "@utils/constants";
import axios from "axios";

export const getVideoStatus = async (videoId) => {
    const endpoint = 'get-video-status';
    return await axios.get(`${BASE_NODE_URI}/${endpoint}/${videoId}`);
}

export const getSinglePost = async (postId) => {
    const endpoint = 'get-single-post';
    
    const response = await axios.post(`${BASE_URI}/${endpoint}`, {
        ReaderPublicKeyBase58Check: APP.PublicKeyBase58Check,
        CommentLimit: 2,
        PostHashHex: postId
    });
    if (response && response.data.PostFound) {
        return response.data.PostFound
    }
    return null
}