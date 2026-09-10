import { useEffect } from "react";
import { supabase } from "../lib/supabase";
import { useNavigate } from "react-router-dom";

export default function Logout() {
  const navigate = useNavigate();

  useEffect(() => {
    const logout = async () => {
      await supabase.auth.signOut();
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