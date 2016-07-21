var speed_forward : float = 0;
var speed_forward_max : float = 40;
var speed_side :float = 40;
var speed_side_max :float = 40;
var speed_up :float = 0;
var speed_up_max: float = 30;
var speed_y: float = 0;
var speed_y_max : float = 12;
var sp_up = 10.0000;
var sp_forward =1.5000;
var sp_side = 1.5000;
var sp_y: float = 0;
var r =0.25;
var spf_t: float;
var sps_t: float;
var spu_t: float;
var spy_t: float;
var input: boolean = false;

var turbo = 0;
var speed_turbo: float =0;

var Gear = 1;

var TurboMax = 100;

var y_axis: float;
var z_axis: float;
var x_axis: float;
var z_axis_max: float = 20;
var x_axis_max: float = 20;

spf_t = Time.time;
sps_t = Time.time;
spu_t = Time.time;


function Awake()
{
	spy_t = 0;
}

function Start ()
{
	speed_forward = 0;
	speed_side = 0;
	InvokeRepeating("speed",0,0.1);
}

function Update() 
{
	r= (Time.deltaTime * 5.5)/Time.timeScale; 
	sp_forward = (Time.deltaTime * 25)/Time.timeScale;
	sp_side = (Time.deltaTime * 25)/Time.timeScale;
	sp_up = (Time.deltaTime * 25)/Time.timeScale;
	sp_y = (Time.deltaTime * 4)/Time.timeScale;
	z_axis = Mathf.DeltaAngle (transform.rotation.eulerAngles.z,0);
	x_axis = Mathf.DeltaAngle (0,transform.rotation.eulerAngles.x);
	y_axis = Mathf.DeltaAngle (0,transform.rotation.eulerAngles.y);
	
	// Forward 
	if (Input.GetKey("up"))
	{
		input = true;
		if (speed_forward < speed_forward_max)
	  	{
	   		speed_forward += sp_forward;
	  	}
		spf_t = Time.time;
		sps_t = Time.time;
	}
	 
	// Backward
	if (Input.GetKey("down"))
	{
		input = true;
	 
	 	if (speed_forward > -speed_forward_max)
	 	{
			speed_forward -= sp_forward;
			spf_t = Time.time;
			sps_t = Time.time;
		}
	} 
	
	// Right
	if (Input.GetKey("right")/* || Input.GetAxis("Horizontal")>0.2*/)
	{
		input = true;
		if (speed_side < speed_side_max)
	 	{
	 		speed_side += sp_side;
	 	}
	 	sps_t = Time.time;
	 	spf_t = Time.time;
	}

	// Left
	if (Input.GetKey("left"))
	{
		input = true;
 		if (speed_side > -speed_side_max)
 		{
			speed_side -= sp_side;
 		}
 		sps_t = Time.time;
 		spf_t = Time.time;
	}
	 
	// Up
	if (Input.GetKey("q"))
	{
		input = true;
		if (speed_up < speed_up_max)
		{
			speed_up += sp_up;
		}
	 	spu_t=Time.time;
	}

	//Down
	if (Input.GetKey("z"))
	{
		if (speed_up > -speed_up_max)
		{
	 		speed_up -= sp_up;
	 	}
	 	spu_t=Time.time;
	}

	// Turn Right
	if (Input.GetKey("w"))
	{
		input = true;
		if (speed_y < speed_y_max)
		{
			speed_y += sp_y;
		}	
		spy_t = Time.time;
	}

	// Turn Left
	if (Input.GetKey("q"))
	{
		input = true;
		if (speed_y >- speed_y_max)
		{
			speed_y -= sp_y;
		}	
		spy_t = Time.time;
	}
	
	if ((speed_forward > 0 && Time.time > spf_t)  || turbo == 2) {speed_forward -=sp_forward/2;if (speed_forward < 0){speed_forward = 0;}}
	if ((speed_forward < -0 && Time.time > spf_t) || turbo ==2) {speed_forward +=sp_forward/2;if (speed_forward > 0){speed_forward = 0;}}
	if (speed_side > 0 && Time.time > sps_t) {speed_side -=sp_side/2;if (speed_side < 0){speed_side = 0;}}
	if (speed_side < -0 && Time.time > sps_t) {speed_side +=sp_side/2;if (speed_side > 0){speed_side = 0;}}
	if (speed_up > 0 && Time.time > spu_t){speed_up -=sp_up/2;if (speed_up < 0){speed_up = 0;}}
	if (speed_up < -0 && Time.time > spu_t){speed_up +=sp_up/2;if (speed_up > 0){speed_up = 0;}}
	if (speed_y > 0 && Time.time > spy_t) {speed_y -=sp_y;if (speed_y < 0){speed_y = 0;}}
	if (speed_y < 0 && Time.time > spy_t) {speed_y +=sp_y;if (speed_y > 0){speed_y = 0;}}
	if ((speed_y > -0.2 && speed_y < 0.2) && Time.time > spy_t+0.2){speed_y = 0;}

	var speed_side_r = Mathf.Round((speed_side/25)*100)/100;
	var speed_up_r = Mathf.Round((speed_up/25)*100)/100;
	var speed_forward_r = Mathf.Round((speed_forward/25)*100)/100;
	
	if (speed_side_r != 0 || speed_up_r != 0 || speed_forward_r !=0)
	{
		transform.Translate(speed_side_r*Time.deltaTime*60,speed_up_r*Time.deltaTime*60,speed_forward_r*Time.deltaTime*60);
	}
	input = false;
}

var positionOld: Vector3;
var speed1: float;

function OnGUI()
{
	// GUI.Label(Rect(5,5,100,20),"Speed: "+speed1);
}

function speed()
{
	speed1 = Mathf.Round((transform.position-positionOld).magnitude)*10*3.6;
	positionOld = transform.position;
}






