const SockJS = require('sockjs-client');
var utils= require('util');
const settings = require('./slobs.json');

let slobs = null;

if (settings.active)
{
	slobs = new SockJS('http://127.0.0.1:59650/api');
}

//ID's
const ID_CONNECT = 1;
const ID_STREAMSTATUS = 2;
const ID_STREAMSTATUS_CHANGED = 3;
const ID_SOURCE = 4;
const ID_SCENES = 5;

var is_streaming = "offline";
let sources = new Map();

module.exports = {
  name: 'slobs-controller-module',
  varname: 'slobs',
  output: slobs,
  activate() {
    console.log('active');
  },
  getStreamingStatus(){
	return is_streaming;
  },
  getSourceList()
  {
	// console.log(sources);  
  },
  setSourceVisible(name)
  {
	  toggleSource(name);
  }
};

if (settings.active)
{
	// SEND AUTH WHEN SOCKET OPENS
	slobs.onopen = (d) => {
	  const connectMessage = JSON.stringify({
		jsonrpc: '2.0',
		id: ID_CONNECT,
		method: 'auth',
		params: {
		  resource: 'TcpServerService',
		  args: [settings.token],
		},
	  });
	  slobs.send(connectMessage);
	};

	// HANDLE MESSAGES RECEIVED
	slobs.onmessage = (d) => {
	  //console.log(d);
	  let a = JSON.parse(d.data);
      console.log(utils.inspect(a, false, null, true));
	  if (d.type == 'message')
	  {  
		if (a.result)
		{
			if (a.id == ID_STREAMSTATUS)
				module.exports.streaming = a.result.streamingStatus;
			
			if (a.result._type !== undefined && a.result._type == 'EVENT')
			  {
				  if (a.result.emitter == 'STREAM')
				  {
					is_streaming = a.result.data;
				  }
			  }
		}
          
		  if (a.id == ID_CONNECT)
		  {
			//subscribeStreaming();
		    //streamingStatus();
			//getSourceIDs();
			getScenes();
		  }
		  
		  if (a.id == ID_SOURCE)
		  {
			  for(var i = 0; i < a.result.length; i++)
			  {
				  if (a.result[i].name !== undefined)
					sources.set(a.result[i].name, a.result[i].sourceId);
			  }
			
		  }
			if(a.id == ID_SCENES)
			{
				console.log(a);
			}
		  
	  }
	};
   
	// EVENT TRIGGERED IF LOOSE CONNECTION TO SLOBS
	slobs.onclose = (d) => {
	  console.log('slobs closed connection');
	};
}

function subscribeStreaming()
	{
	const message = JSON.stringify(
	  {
		  "id":ID_STREAMSTATUS_CHANGED,
		  "jsonrpc":"2.0",
		  "method":"streamingStatusChange",
		  "params":{"resource":"StreamingService"}
	  })
	  slobs.send(message);
	}
	
function streamingStatus()
{
	const message = JSON.stringify(
	{
		"id":ID_STREAMSTATUS,
		"jsonrpc":"2.0",
		"method":"getModel",
		"params":{"resource":"StreamingService"}
	});
	slobs.send(message);
}

function getScenes()
{
	const message = JSON.stringify(
	{
		"id":ID_SCENES,
		"jsonrpc":"2.0",
		"method":"getScenes",
		"params":{"resource":"ScenesService"}
	});
	slobs.send(message);
}

function getSourceIDs()
{
	const message = JSON.stringify(
	{
		"id":ID_SOURCE,
		"jsonrpc":"2.0",
		"method":"getSources",
		"params":{"resource":"SourcesService"}
	});
	slobs.send(message);
}

function sourceProperties(sourceName)
{
	//console.log(`Source name: ${sourceName} - ID: ${sources.get(sourceName)}`);
	const message = JSON.stringify(
	{
		"id":5,
		"jsonrpc":"2.0",
		"method":"getSource",
		"params":{"args":["text_gdiplus_4769fef2-ce24-4383-9491-b1732c65b9a6"],"resource":"SourcesService"}
	});
	slobs.send(message);
}

function toggleSource(sourceName)
{
	//console.log(`Source name: ${sourceName} - ID: ${sources.get(sourceName)}`);
	const message = JSON.stringify(
	{
		"id":10,
		"jsonrpc":"2.0",
		"method":"setVisibility",
		"params":{"resource":"SceneItem[\"scene_c134b167-3685-4437-890f-c8aeb13b5c74\", \"7803dd56-b1b5-4211-ace3-7ce2f5bd3571\", \"text_gdiplus_0bf59592-9d8a-4595-b0e5-437c87be15e3\"]","args":[false]}
	});
	slobs.send(message);
}