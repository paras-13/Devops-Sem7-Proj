// import { useContext } from "react";
// import "./stories.scss";
// import { AuthContext } from "../../context/authContext";

// const Stories = () => {
//   const { currentUser } = useContext(AuthContext);

//   //TEMPORARY
//   const stories = [
//     {
//       id: 1,
//       name: "John Doe",
//       img: "https://images.pexels.com/photos/13916254/pexels-photo-13916254.jpeg?auto=compress&cs=tinysrgb&w=1600&lazy=load",
//     },
//     {
//       id: 2,
//       name: "John Doe",
//       img: "https://images.pexels.com/photos/13916254/pexels-photo-13916254.jpeg?auto=compress&cs=tinysrgb&w=1600&lazy=load",
//     },
//     {
//       id: 3,
//       name: "John Doe",
//       img: "https://images.pexels.com/photos/13916254/pexels-photo-13916254.jpeg?auto=compress&cs=tinysrgb&w=1600&lazy=load",
//     },
//     {
//       id: 4,
//       name: "John Doe",
//       img: "https://images.pexels.com/photos/13916254/pexels-photo-13916254.jpeg?auto=compress&cs=tinysrgb&w=1600&lazy=load",
//     },
//   ];

//   return (
//     <div className="stories">
//       <div className="story">
//         <img src={currentUser.profilePic} alt="" />
//         <span>{currentUser.name}</span>
//         <button>+</button>
//       </div>
//       {stories.map((story) => (
//         <div className="story" key={story.id}>
//           <img src={story.img} alt="" />
//           <span>{story.name}</span>
//         </div>
//       ))}
//     </div>
//   );
// };

// export default Stories;

import { useContext } from "react";
import "./stories.scss";
import { AuthContext } from "../../context/authContext";

const Stories = () => {
  const { currentUser } = useContext(AuthContext);

  const stories = [
    {
      id: 1,
      name: "Ayesha Khan",
      img: "https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=1600", // College stylish girl photo
    },
    {
      id: 2,
      name: "Bob Smith",
      img: "https://images.pexels.com/photos/2379005/pexels-photo-2379005.jpeg?auto=compress&cs=tinysrgb&w=1600",
    },
    {
      id: 3,
      name: "Charlie Brown",
      img: "https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=1600",
    },
    {
      id: 4,
      name: "Diana Prince",
      img: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=1600",
    },
  ];

  return (
    <div className="stories">
      <div className="story">
        <img src={currentUser.profilePic} alt="" />
        <span>{currentUser.name}</span>
        <button>+</button>
      </div>
      {stories.map((story) => (
        <div className="story" key={story.id}>
          <img src={story.img} alt="" />
          <span>{story.name}</span>
        </div>
      ))}
    </div>
  );
};

export default Stories;
