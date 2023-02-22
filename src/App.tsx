import React, { ChangeEvent, CSSProperties } from "react";

interface BankType {
  keyCode: string;
  id: string;
  url: string;
}

const bankOne: BankType[] = [
  {
    keyCode: "Q",
    id: "Heater-1",
    url: "https://s3.amazonaws.com/freecodecamp/drums/Heater-1.mp3",
  },
  {
    keyCode: "W",
    id: "Heater-2",
    url: "https://s3.amazonaws.com/freecodecamp/drums/Heater-2.mp3",
  },
  {
    keyCode: "E",
    id: "Heater-3",
    url: "https://s3.amazonaws.com/freecodecamp/drums/Heater-3.mp3",
  },
  {
    keyCode: "A",
    id: "Heater-4",
    url: "https://s3.amazonaws.com/freecodecamp/drums/Heater-4_1.mp3",
  },
  {
    keyCode: "S",
    id: "Clap",
    url: "https://s3.amazonaws.com/freecodecamp/drums/Heater-6.mp3",
  },
  {
    keyCode: "D",
    id: "Open-HH",
    url: "https://s3.amazonaws.com/freecodecamp/drums/Dsc_Oh.mp3",
  },
  {
    keyCode: "Z",
    id: "Kick-n'-Hat",
    url: "https://s3.amazonaws.com/freecodecamp/drums/Kick_n_Hat.mp3",
  },
  {
    keyCode: "X",
    id: "Kick",
    url: "https://s3.amazonaws.com/freecodecamp/drums/RP4_KICK_1.mp3",
  },
  {
    keyCode: "C",
    id: "Closed-HH",
    url: "https://s3.amazonaws.com/freecodecamp/drums/Cev_H2.mp3",
  },
];

const bankTwo: BankType[] = [
  {
    keyCode: "Q",
    id: "Chord-1",
    url: "https://s3.amazonaws.com/freecodecamp/drums/Chord_1.mp3",
  },
  {
    keyCode: "W",
    id: "Chord-2",
    url: "https://s3.amazonaws.com/freecodecamp/drums/Chord_2.mp3",
  },
  {
    keyCode: "E",
    id: "Chord-3",
    url: "https://s3.amazonaws.com/freecodecamp/drums/Chord_3.mp3",
  },
  {
    keyCode: "A",
    id: "Shaker",
    url: "https://s3.amazonaws.com/freecodecamp/drums/Give_us_a_light.mp3",
  },
  {
    keyCode: "S",
    id: "Open-HH",
    url: "https://s3.amazonaws.com/freecodecamp/drums/Dry_Ohh.mp3",
  },
  {
    keyCode: "D",
    id: "Closed-HH",
    url: "https://s3.amazonaws.com/freecodecamp/drums/Bld_H1.mp3",
  },
  {
    keyCode: "Z",
    id: "Punchy-Kick",
    url: "https://s3.amazonaws.com/freecodecamp/drums/punchy_kick_1.mp3",
  },
  {
    keyCode: "X",
    id: "Side-Stick",
    url: "https://s3.amazonaws.com/freecodecamp/drums/side_stick_1.mp3",
  },
  {
    keyCode: "C",
    id: "Snare",
    url: "https://s3.amazonaws.com/freecodecamp/drums/Brk_Snr.mp3",
  },
];

const activeStyle: React.CSSProperties = {
  backgroundColor: "orange",
  boxShadow: "0 3px black",
  height: 77,
  marginTop: 13,
};

const inactiveStyle: React.CSSProperties = {
  backgroundColor: "#74b9ff",
  marginTop: 10,
  boxShadow: "3px 3px 5px black",
};

interface DrumPadProp {
  keyCode: string;
  clipId: string;
  clip: string;
  updateDisplay: (s: string) => void;
}

interface DrumPadState {
  padStyle?: React.CSSProperties;
  actived: boolean;
}

class DrumPad extends React.Component<DrumPadProp, DrumPadState> {
  constructor(props: DrumPadProp) {
    super(props);
    this.state = {
      actived: false,
    };
  }
  componentDidMount() {
    document.addEventListener("keydown", this.handleKeyPress);
  }
  componentWillUnmount() {
    document.removeEventListener("keydown", this.handleKeyPress);
  }
  handleKeyPress = (e: KeyboardEvent) => {
    let key = "";
    if (e.key) {
      key = e.key.toUpperCase();
    }
    if (key === this.props.keyCode) {
      this.playSound();
    }
  };
  toggleActive = () => {
    this.setState((prevState, props) => {
      return { actived: !prevState.actived };
    });
  };
  playSound = () => {
    const sound: HTMLAudioElement = document.getElementById(
      this.props.keyCode
    ) as HTMLAudioElement;
    sound.currentTime = 0;
    sound.play();
    this.toggleActive();
    // sound.addEventListener("ended", ()=>{})
    setTimeout(() => this.toggleActive(), 100);
    this.props.updateDisplay(this.props.clipId.replace(/-/g, " "));
  };
  render() {
    return (
      <div
        id={this.props.clipId}
        onClick={this.playSound}
        className={this.state.actived ? "drum-pad actived" : "drum-pad"}
        // className={"drum-pad actived"}
        // style={this.state.padStyle}
      >
        <audio
          className="clip"
          id={this.props.keyCode}
          src={this.props.clip}
        ></audio>
        {this.props.keyCode}
      </div>
    );
  }
}

interface PadBankState {
  padStyle: React.CSSProperties;
}
interface PadBankProp {
  currentPadBank: BankType[];
  updateDisplay: (a: string) => void;
}
class PadBank extends React.Component<PadBankProp, PadBankState> {
  constructor(props: PadBankProp) {
    super(props);
  }
  render() {
    let padBank = this.props.currentPadBank.map((drumObj, i) => {
      return (
        <DrumPad
          clipId={drumObj.id}
          key={i}
          clip={drumObj.url}
          keyCode={drumObj.keyCode}
          updateDisplay={this.props.updateDisplay}
        />
      );
    });
    return <div className="pad-bank">{padBank}</div>;
  }
}

interface AppState {
  display: string;
  currentPadBank: BankType[];
  currentPadBankId: string;
  sliderVal: number;
}

class App extends React.Component<{}, AppState> {
  constructor(props: {}) {
    super(props);
    this.state = {
      display: String.fromCharCode(160),
      currentPadBank: bankOne,
      currentPadBankId: "Heater Kit",
      sliderVal: 0.3,
    };
  }

  displayClipName = (name: string) => {
    this.setState({
      display: name,
    });
  };

  clearDisplay = () => {
    this.setState({
      display: String.fromCharCode(160),
    });
  };
  render() {
    return (
      <div id="drum-machine" className="inner-container">
        <PadBank
          updateDisplay={this.displayClipName}
          currentPadBank={this.state.currentPadBank}
        />

        <div className="controls-container">
          <p id="display">{this.state.display}</p>
        </div>
      </div>
    );
  }
}

export default App;
