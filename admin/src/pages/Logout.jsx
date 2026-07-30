import { useEffect } from "react";
import { signOut } from "firebase/auth";
import { auth } from "../json_data/firebase";
import { useNavigate } from "react-router-dom";

export default function Logout() {
  const navigate = useNavigate();

  useEffect(() => {
    const logout = async () => {
      await signOut(auth);
      navigate("/", { replace: true });
    };

    logout();
  }, [navigate]);

  return (
    <div className="min-h-screen flex justify-center items-center">
      Logging out...
    </div>
  );
}