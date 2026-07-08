export class Client {
    constructor(
        public readonly userId: number,

        private averageRating: number
    ) {}

    changeAverageRating(
        averageRating: number
    ): void {

        if (averageRating < 0 || averageRating > 5) {
            throw new Error("Invalid average rating.");
        }

        this.averageRating = averageRating;

    }

    getAverageRating(): number {
        return this.averageRating;
    }

    getUserId(): number {
        return this.userId;
    }
}