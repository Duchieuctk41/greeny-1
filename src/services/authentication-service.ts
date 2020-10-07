import { Injectable, NgZone } from '@angular/core';
import { auth } from 'firebase/app';
import { User } from '../models/user';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';

@Injectable({
    providedIn: 'root'
})

export class AuthenticationService {
    userData: any;

    constructor(
        public afStore: AngularFirestore,
        public ngFireAuth: AngularFireAuth,
        public router: Router,
        public ngZone: NgZone
    ) {
        this.ngFireAuth.authState.subscribe(user => {
            if (user) {
                this.userData = user;
               //localStorage.setItem('user', JSON.stringify(this.userData));
                //JSON.parse(localStorage.getItem('user'));
            } else {
                //localStorage.setItem('user', null);
                //JSON.parse(localStorage.getItem('user'))
            }
        })
    }
    
    //====UPDATE=====
    //SendVeritification(){}
    //PasswordRecover(){}
    // get isEmailVerified(){}

    SignIn(email, password) {
        return this.ngFireAuth.signInWithEmailAndPassword(email, password);
    }

    RegisterUser(email, password) {
        return this.ngFireAuth.createUserWithEmailAndPassword(email, password);
    }

    // Returns true when user is looged in
    get isLoggedIn(): boolean {
        return false
        // const user = JSON.parse(localStorage.getItem('user'));
        // return (user !== null && user.emailVerified !== false) ? true : false;
    }

    GoogleAuth() {
        return this.AuthLogin(new auth.GoogleAuthProvider());
    }

    // Auth providers
    AuthLogin(provider) {
        return this.ngFireAuth.signInWithPopup(provider)
            .then((result) => {
                this.ngZone.run(() => {
                    this.router.navigate(['home']);
                })
                this.SetUserData(result.user);
            }).catch((error) => {
                window.alert(error)
            })
    }

    // Store user in localStorage
    SetUserData(user) {
        const userRef: AngularFirestoreDocument<any> = this.afStore.doc(`users/${user.uid}`);
        const userData: User = {
            email: user.email,
            amount: 1000,
            password: user.password
        }
        return userRef.set(userData, {
            merge: true
        })
    }

    SignOut() {
        return this.ngFireAuth.signOut().then(() => {
           // localStorage.removeItem('user');
            this.router.navigate(['login'])
        })
    }
}
