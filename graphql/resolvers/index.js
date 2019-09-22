const bcrypt = require('bcrypt');

const Event = require('../../models/events');
const User = require('../../models/users');
const Bookings = require('../../models/booking')

const events = async eventIds => {
  try {
    const events = await Event.find({ _id: { $in: eventIds } });
    events.map(event => {
      return {
        ...event._doc,
        _id: event.id,
        date: new Date(event._doc.date).toISOString(),
        creator: user.bind(this, event.creator)
      };
    });
    return events;
  } catch (err) {
    throw err;
  }
};

const user = async userId => {
  try {
    const user = await User.findById(userId);
    return {
      ...user._doc,
      _id: user.id,
      createdEvents: events.bind(this, user._doc.createdEvents)
    };
  } catch (err) {
    throw err;
  }
};

const singleEvent = async eventId=>{
    try {
        const events = await Event.findById({_id:eventId});
          return {
            ...event._doc,
            _id: event.id,
            date: new Date(event._doc.date).toISOString(),
            creator: user.bind(this, event.creator)
          };
      } catch (err) {
        throw err;
      }
}

module.exports = {

  events: async () => {
    try {
      const events = await Event.find();
      return events.map(event => {
        return {
          ...event._doc,
          _id: event.id,
          date: new Date(event._doc.date).toISOString(),
          creator: user.bind(this, event._doc.creator)
        };
      });
    } catch (err) {
      throw err;
    }
  },

  bookings: async()=>{
    try{
      const bookings = await Bookings.find()
      return bookings.map(booking=>{
          return {
              ...booking._doc,
              id:booking._id,
              event : singleEvent.bind(this,booking._doc.event),
              user : user.bind(this,booking._doc.user),
              createdAt: new Date(booking._doc.createdAt.toISOString()),
              updatedAt: new Date(booking._doc.updatedAt.toISOString())

          }
      })  
    }
    catch{

    }
  },

  createEvent: async args => {
    const event = new Event({
      title: args.eventInput.title,
      description: args.eventInput.description,
      price: +args.eventInput.price,
      date: new Date(args.eventInput.date),
      creator: '5d862c1b91fd695d2b3f6cf9'
    });
    let createdEvent;
    try {
      const result = await event.save();
      createdEvent = {
        ...result._doc,
        _id: result._doc._id.toString(),
        date: new Date(event._doc.date).toISOString(),
        creator: user.bind(this, result._doc.creator)
      };
      const creator = await User.findById('5d862c1b91fd695d2b3f6cf9');

      if (!creator) {
        throw new Error('User not found.');
      }
      creator.createdEvents.push(event);
      await creator.save();

      return createdEvent;
    } catch (err) {
      console.log(err);
      throw err;
    }
  },
  
  createUser: async args => {
    try {
      const existingUser = await User.findOne({ email: args.userInput.email });
      if (existingUser) {
        throw new Error('User exists already.');
      }
      const hashedPassword = await bcrypt.hash(args.userInput.password, 12);

      const user = new User({
        email: args.userInput.email,
        password: hashedPassword
      });

      const result = await user.save();

      return { ...result._doc, password: null, _id: result.id };
    } catch (err) {
      throw err;
    }
  },

  bookEvent: async args=>{
    const fetchedevent = await Event.findOne({_id:args.eventId})
    const booking = new Bookings({
        user:'5d862c1b91fd695d2b3f6cf9',
        event: fetchedevent 
      })
    const result = await booking.save()
    return {
        ...result._doc,
        _id:result.id,
        event : singleEvent.bind(this,booking._doc.event),
        user : user.bind(this,booking._doc.user),
        createdAt: new Date(result.createdAt.toISOString()),
        updatedAt: new Date(result.updatedAt.toISOString())

    }

  },

  cancelBooking: async args => {
    try {
      const booking = await Booking.findById(args.bookingId).populate('event');
      const event = {
        ...booking.event._doc,
        _id: booking.event.id,
        creator: user.bind(this, booking.event._doc.creator)
      };
      await Booking.deleteOne({ _id: args.bookingId });
      return event;
    } catch (err) {
      throw err;
    }
  }
};