import { Bluejet } from "@/core/bluejet";
import { initAuthState } from "@/modules/auth/auth-obs";

export class BluejetWebImpl extends Bluejet {
  async prepare(): Promise<void> {
    await initAuthState();
  }
  restart(): void {
    window.location.reload();
  }
}
