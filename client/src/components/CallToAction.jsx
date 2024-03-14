import { Button } from "flowbite-react";

function CallToAction() {
  return (
    <div className="flex flex-col sm:flex-row p-3 border border-teal-500 justify-center items-center rounded-tl-3xl rounded-br-3xl text-center">
      <div className="flex-1 justify-center flex flex-col">
        <h2 className="text-2xl">Want to learn more about me!?</h2>
        <p className="text-gray-500 my-2 ">Check out my personal website</p>
        <Button gradientDuoTone="purpleToPink" disabled={true}>
          Click me
        </Button>
      </div>
      <div className="p-7 flex-1">
        <img
          src="https://miro.medium.com/v2/resize:fit:678/0*kxPYwfJmkXZ3iCWy.png"
          alt="mern image"
        />
      </div>
    </div>
  );
}

export default CallToAction;
