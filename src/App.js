import "./App.css";
import { useEffect, useState } from "react";

function App() {
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState(null);
  const [previousChats, setPreviousChats] = useState([]);
  const [currentTitle, setCurrentTitle] = useState(null);
  const [directPrompt, setDirectPrompt] = useState("");
  const [mainPageCenter, setMainPageCenter] = useState("mainPageCenter");
  const [mobileBar, setMobileBar] = useState("side-bar");
  const [mainPage, setMainPage] = useState("main");

  // Creates a new chat
  const createNewChat = () => {
    setPrompt("");
    setResponse(null);
    setCurrentTitle(null);
  };

  // Handles history click
  const handleClick = (uniqueTitle) => {
    setCurrentTitle(uniqueTitle);
    setPrompt("");
    setResponse(null);
  };

  // Saves input to prompt & directprompt
  const handleSubmit = async (e) => {
    e.preventDefault();
    setDirectPrompt(prompt);
    setMainPageCenter("mainPageCenterHide");
    document.querySelector("#question").value = "";

    // API call to backend
    const options = {
      method: "POST",
      body: JSON.stringify({
        message: prompt,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    };

    try {
      const response = await fetch("http://localhost:8080/chat", options);
      const data = await response.json();
      setResponse(data.choices[0].message.content);
    } catch (error) {
      console.error(error);
    }
  };

  // Sets prompts and roles
  useEffect(() => {
    if (!currentTitle && prompt && response) {
      setCurrentTitle(prompt);
    }

    if (currentTitle && prompt && response) {
      setPreviousChats((prevChats) => [
        ...prevChats,
        {
          title: currentTitle,
          role: "User",
          content: prompt,
        },
        {
          title: currentTitle,
          role: "Stuby",
          content: response,
        },
      ]);
      setDirectPrompt("");
      setMainPageCenter("mainPageCenter");
    }
  }, [response, currentTitle]);


  // Adds function to press enter to submit
  const keydownHandler = (event) => {
    event.stopImmediatePropagation();
    if (
      event.key === "Enter" &&
      !document.querySelector("#question").value == ""
    ) {
      document.querySelector("#submit").click();
    }
  };

  document.addEventListener("keydown", keydownHandler);

  // Changes mobile classes from click
  const menuClickHandle = () => {
    if (mobileBar == "side-bar") {
    setMobileBar("mobile-bar");
    setMainPage("main-mobile")
  }
    else {
      setMobileBar("side-bar");
      setMainPage("main")
    }
  };

  // Changes mobile classes from window resize
  const x = window.matchMedia("(max-width: 992px)")

  const resizeHandle = (ev) => {
    ev.stopImmediatePropagation()
    if (!x.matches) {
      setMobileBar("side-bar");
      setMainPage("main")
    } 
  }

  x.addEventListener("change", resizeHandle)

  // Filters through chats
  const currentChat = previousChats.filter(
    (previousChat) => previousChat.title === currentTitle
  );
  const uniqueTitles = Array.from(
    new Set(previousChats.map((previousChat) => previousChat.title))
  );

  return (
    <div className="app">
      <img
          src="/menu.png"
          alt="hamburger bar menu"
          className="menu"
          onClick={menuClickHandle}
        />
      <section className={mobileBar}>
        <button onClick={createNewChat}>+ New Chat</button>
        <ul className="history">
          {uniqueTitles?.map((uniqueTitle, index) => (
            <li key={index} onClick={() => handleClick(uniqueTitle)}>
              {uniqueTitle}
            </li>
          ))}
        </ul>
        <nav>
          <p>Made by Hugo</p>
        </nav>
      </section>

      <section className={mainPage}>
        
        {!currentTitle && <h1>StubyGPT</h1> && (
          <div className={mainPageCenter}>
            <img src="/logo-white.png" alt="A white logo of StubyGPT" />
          </div>
        )}
        <ul className="feed">
          {currentChat?.map((chatMessage, index) => (
            <li key={index}>
              <p className="role">{chatMessage.role}</p>
              <p className="message">{chatMessage.content}</p>
            </li>
          ))}

          {!directPrompt == "" && (
            <li className="directListItem">
              <p className="role">User</p>
              <p className="message">{directPrompt}</p>
            </li>
          )}
        </ul>
        <div className="bottom-section">
          <div className="input-container">
            <input
              type="text"
              id="question"
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Ask me something..."
            />
            <div id="submit" onClick={handleSubmit}>
              ➢
            </div>
          </div>
          <p className="info">
            StubyGPT can make mistakes. Consider checking important information.
          </p>
        </div>
      </section>
    </div>
  );
}

export default App;
