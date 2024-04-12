#### Overview.ai

## Running the project
Once you're inside the root folder you can start the containers through one command:
```bash
$ docker-compose up --build -d
```
This command will start everything you need: the DB, the API and the frontend.
To access the application, visit [http://localhost:3000](http://localhost:300).

## Considerations
(I'm ignoring authentication/authorization here and user-scoping because it's too trivial)

- Ideally the video processing logic would be extracted to a microservice. It's not ideal to keep this heavy processing inside the same API that interfaces with the frontend.
- Not having an isolated microservice to process the video's predictions leads to idle processings in case of a system outage. This could be avoided with extra logic for checking idle processings that are not running, but would increase complexity and is not ideal compared to an MS.
- Processing a frame takes a lot of time and it's a slow task to process a whole video, even if it's a small one. In a real world scenario if speed was a key factor there would have to be multiple instances of this MS to process batches of frames concurrently, which we're able to do without inconsistency issues since we keep track of the frame number and timestamp.
- I believe it would be better for the video processing to be made in-memory, seems like it's the more scalable way to go, but I had some struggle to get frame by frame of the video in-memory in a smooth and fast way and went with the temporary file solution to not risk not meeting the deadline.

This was a very interesting test, probably the most interesting and uncommon take-home assessment I've ever went through. The challenges were fun and the outcome was awesome to see, in comparison to the usual basic CRUD stuff you get.
