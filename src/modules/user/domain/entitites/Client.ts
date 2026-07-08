export class Client {
    constructor(
        public readonly userId: string,

        private averageRating: number
    ) {}

    public updateAverageRating(rating: number): void {
        if (rating < 0 || rating > 5) {
            throw new Error("Invalid rating.");
        }

        this.averageRating = rating;
    }

    getAverageRating(): number {
        return this.averageRating;
    }
}