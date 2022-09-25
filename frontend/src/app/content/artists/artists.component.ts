import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {Apollo, gql} from "apollo-angular";
import {Subscription} from "rxjs";
import {Artist} from "./artist/artist";

@Component({
  selector: 'app-artists',
  templateUrl: './artists.component.html',
  styleUrls: ['./artists.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ArtistsComponent implements OnInit {
  public artists: Artist[] = [];

  public isLoading: boolean = true;
  public isDBInitialized: boolean = true;

  constructor(private apollo: Apollo, private changeDetectorRef: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.fetchArtists();
  }

  private fetchArtists(fetchPolicy?: "no-cache") {
    const subscription: Subscription = this.apollo.query<{artistSearch: Artist[]}>({
      query: gql`query {
        artistSearch {
          id
          name
          link
          picture
          nAlbums
          nFans
        }
      }`,
      fetchPolicy: fetchPolicy
    }).subscribe({
      next: (res) => {
        subscription.unsubscribe();
        this.isLoading = false;
        this.changeDetectorRef.markForCheck();

        if (res.data.artistSearch.length === 0) {
          this.isDBInitialized = false;
          this.changeDetectorRef.markForCheck();
          return;
        }

        this.isDBInitialized = true;
        this.artists = res.data.artistSearch;
        this.changeDetectorRef.markForCheck();
      },
      error: (e: Error) => {
        subscription.unsubscribe();
        this.isLoading = false;
        this.changeDetectorRef.markForCheck();
        console.error(e);
      },
      complete: () => subscription.unsubscribe()
    });
  }

  public initDB() {
    this.isLoading = true;
    this.changeDetectorRef.markForCheck();

    const subscription: Subscription = this.apollo.mutate({
      mutation: gql`mutation {
        initialize
      }`
    }).subscribe({
      next: (res) => {
        subscription.unsubscribe();
        setTimeout(() => this.fetchArtists("no-cache"), 30_000); // wait some time for the database to be populated
      },
      error: (e: Error) => {
        subscription.unsubscribe();
        console.error(e);
      },
      complete: () => subscription.unsubscribe()
    });
  }

}
