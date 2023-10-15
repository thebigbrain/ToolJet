import { Bluejet } from "@/core/bluejet";
import { getAuthState, initAuthState } from "@/modules/auth/auth-obs";
import { initRoutes } from "./allRoutes";
import { getCurrentUser } from "../users";

export class BluejetWebImpl extends Bluejet {
  async prepare(): Promise<void> {
    await initAuthState();
    initRoutes(getAuthState());
  }
  restart(): void {
    window.location.reload();
  }
}
