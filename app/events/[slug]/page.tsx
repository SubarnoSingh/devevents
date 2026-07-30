import {notFound} from "next/navigation";
import Image from "next/image";
import BookEvent from "@/components/BookEvent";
import {IEvent} from "@/database";
import {getSimilarEventsBySlug} from "@/lib/actions/event.actions";
import EventCard from "@/components/EventCard";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

const EventDetailsItem = ({icon , alt , label } : {icon: string; alt: string; label: string;}) => (
    <div className={"flex-row-gap-2 items-center"}>
        <Image src={icon} alt={alt} width={17} height={17} />
        <p>{label}</p>
    </div>
)

const EventAgenda = ({ agendaItems }: {agendaItems: string[]}) => (
    <div className={"agenda"}>
        <h2>Agenda</h2>
        <ul>
            {agendaItems.map(item => (
                <li key={item}>
                    {item}
                </li>
            ))}
        </ul>
    </div>
)

const EventTags = ({ tags }: {tags: string[]}) => (
    <div className={"flex flex-row gap-1.5 flex-wrap"}>
        {tags.map((tag) =>(
            <div className={"pill"} key={tag}>
                {tag}
            </div>
        ))}
    </div>
)

interface PageProps {
    params: Promise<{
        slug: string;
    }>;
}

const EventDetailsPage = async ({ params }: PageProps) => {
    const { slug } = await params;
    const request = await fetch(`${BASE_URL}/api/events/${slug}`);
    const {event : {description , image , overview , date , time , location , mode , agenda , audience , tags , organizer}} = await request.json();

    const bookings  = 10;

    const similarEvents : IEvent[] = await getSimilarEventsBySlug(slug);

    if(!description) return notFound();

    return(
        <section id={"event"}>
            <div className="header">
                <h1>Event Description</h1>

                <p className={"mt-2"}>{description}</p>
            </div>
            <div className="details">
                {/* Left side - Event content */}
                <div className="content">
                    <Image src={image} alt={"Event Banner"} width={800} height={800} className="banner"/>
                </div>

                <section className={"flex-col-gap-2"}>
                    <h2>Overview</h2>
                    <p>{overview}</p>
                </section>

                <section className="flex-col-gap-2">
                    <h2>Event Details</h2>

                    <EventDetailsItem icon={"/icons/calendar.svg"} alt={"calendar"} label={date} />
                    <EventDetailsItem icon={"/icons/clock.svg"} alt={"clock"} label={time} />
                    <EventDetailsItem icon={"/icons/pin.svg"} alt={"pin"} label={location} />
                    <EventDetailsItem icon={"/icons/mode.svg"} alt={"mode"} label={mode} />
                    <EventDetailsItem icon={"/icons/audience.svg"} alt={"audience"} label={audience} />

                </section>

                <EventAgenda agendaItems={agenda} />


                <section className={"flex-col-gap-2"}>
                    <h2>About The Organizer</h2>
                    <p>{organizer}</p>
                </section>

                <EventTags tags={tags} />

                {/* Right side - Booking form */}
                <aside className="booking">
                    <div className="signup-crad">
                        <h2>Book Your Spot</h2>
                        {bookings > 0 ? (
                            <p className={"text-sm"}>
                                Join {bookings} people who have already booked their spot!
                            </p>
                        ) : (
                            <p className={"text-sm"}> Be the First to book your spot</p>
                        )}

                        <BookEvent  />
                    </div>
                </aside>
            </div>
            <div className={"flex w-full flex-col gap-4 pt-20"}>
                <h2>Similar Events</h2>
                <div className={'events'}>
                    {similarEvents.length > 0 && similarEvents.map((similarEvent: IEvent) => (
                        <EventCard key={similarEvent.title} {...similarEvent} />
                    ))}
                </div>
            </div>
        </section>
    )
};

export default EventDetailsPage;