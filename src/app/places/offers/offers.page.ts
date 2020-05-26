import { Component, OnInit, OnDestroy } from "@angular/core";
import { PlacesService } from "../places.service";
import { Place } from "../place.model";
import { IonItemSliding } from "@ionic/angular";
import { Router } from "@angular/router";
import { Subscription } from "rxjs";
import { filter, tap, take, switchMap } from "rxjs/operators";
import { AuthService } from "src/app/auth/auth.service";

@Component({
  selector: "app-offers",
  templateUrl: "./offers.page.html",
  styleUrls: ["./offers.page.scss"],
})
export class OffersPage implements OnInit, OnDestroy {
  offers: Place[];
  private placesSub: Subscription;
  isLoading = false;
  constructor(
    private placesService: PlacesService,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit() {
    // this.placesService.places.subscribe((places) => {
    //   this.offers = places;
    // });
    let fetchedUserId: string;
  this.placesSub=  this.authService.userId
      .pipe(
        take(1),
        switchMap((userId) => {
          fetchedUserId = userId;
          return this.placesService.places;
        })
      )
      .subscribe((places) => {
        this.offers = places.filter((p) => p.userId === fetchedUserId);
      });
  }
  onEdit(offerId: string, slidingItem: IonItemSliding) {
    slidingItem.close();
    this.router.navigate(["/", "places", "tabs", "offers", "edit", offerId]);
  }

  ionViewWillEnter() {
    // this.isLoading = true;
    // this.placesService.fetchPlaces().subscribe(() => {
    //   this.isLoading = false;
    // });
    let fetchedUserId: string;
  this.placesSub=  this.authService.userId
      .pipe(
        take(1),
        switchMap((userId) => {
          fetchedUserId = userId;
          return this.placesService.places;
        })
      )
      .subscribe((places) => {
        this.offers = places.filter((p) => p.userId === fetchedUserId);
      });
    console.log("ION VIEW WILL ENTER CALISTI");
  }

  onDelete(offerId: string, slidingItem: IonItemSliding) {
    slidingItem.close();
    this.placesService.deletePlace(offerId).subscribe();
  }

  ngOnDestroy() {
    if (this.placesSub) {
      this.placesSub.unsubscribe();
    }
  }
}
