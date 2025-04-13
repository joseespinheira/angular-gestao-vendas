import { Directive, HostListener } from "@angular/core";
import { Auth, signInWithPopup, signInWithEmailAndPassword, signOut } from "@angular/fire/auth";
import { GoogleAuthProvider } from "@firebase/auth";

@Directive({
  selector: "[googleSso]",
})
export class GoogleSsoDirective {
  constructor(
    private angularFireAuth: Auth
  ) {}
  @HostListener("click")
  async onClick() {
    const creds = await signInWithPopup(
      this.angularFireAuth,
      new GoogleAuthProvider()
    );
    // do what you want with the credentials, for ex adding them to firestore...
    console.log('Falta implementar o que fazer com as credenciais', creds);
  }
}