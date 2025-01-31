import * as Google from "expo-auth-session/providers/google";
import { GoogleAuthProvider, signInWithCredential } from "firebase/auth";
import { auth } from "./FireBaseConfig";

// Google Sign-In Function
export const signInWithGoogle = async () => {
  try {
    const [request, response, promptAsync] = Google.useAuthRequest({
      clientId: "YOUR_GOOGLE_WEB_CLIENT_ID",
      iosClientId: "YOUR_GOOGLE_IOS_CLIENT_ID",
      androidClientId: "YOUR_GOOGLE_ANDROID_CLIENT_ID",
    });

    if (response?.type === "success") {
      const { id_token } = response.authentication;
      const credential = GoogleAuthProvider.credential(id_token);
      await signInWithCredential(auth, credential);
    }
  } catch (error) {
    console.error("Google sign-in failed:", error);
  }
};
