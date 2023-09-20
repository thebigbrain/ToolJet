import { Bluejet } from "@/core/bluejet";

export class BluejetWebImpl extends Bluejet {
  restart(): void {
    window.location.reload();
  }
}
