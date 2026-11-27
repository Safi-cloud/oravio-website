import { redirect } from "next/navigation";
// De Android-app opent altijd <adres>/start.
export default function Start() {
  redirect("/kompas");
}
