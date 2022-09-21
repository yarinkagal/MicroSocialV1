export class ProfileComponent {
    public static userEmail : string = ""
}

export interface Event {
    id: string;
    maxParticipants: number;
    owner: string;
    category: string;
    time: string;
    date: string;
    //participantsList: List<User>;
}