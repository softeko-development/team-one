import { redirect } from "next/navigation";

export default function NewPostRedirectPage() {
  redirect("/posts?new=true");
}
