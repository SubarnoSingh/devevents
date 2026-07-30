'use client'
import {useState} from "react";
import {createbooking} from "@/lib/actions/booking.action";
import posthog from "posthog-js";

const BookEvent = ({ eventId , slug} : {eventId : string , slug : string}) => {

    const [email , setEmail] = useState('');
    const [submitted , setSubmitted] = useState<boolean>(false);

    const handleSubmit = async (e : React.FormEvent) => {
        const { success } = await createbooking({ eventId , slug , email});

        if(success){
            setSubmitted(true);
            posthog.capture('event booked', {eventId, slug, email});
        }else{
            console.error('Booking failed with error');
            posthog.captureException('Booking failed with error');
        }

        e.preventDefault();

        setTimeout(() =>{
            setSubmitted(true);
        }, 1000)
    }

    return (
        <div id={"book-event"}>
            {submitted ? (
                <p className={"text-sm"}> Thank You For Signing up!</p>
            ): (
                <form onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="email">Email Address</label>
                        <input type="email"
                               value={email}
                               onChange={(e) => setEmail(e.target.value)}
                               id={"email"}
                               placeholder={"Enter your Email Address"}

                        />
                    </div>
                    <button type={"submit"} className={"button-submit"}>Submit</button>
                </form>
            )}
        </div>
    )
}
export default BookEvent
