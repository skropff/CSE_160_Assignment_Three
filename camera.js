class Camera {
	constructor(canvas) {
		this.fov = 60;
		this.eye = new Vector3([0, 0, 0]);
		this.at = new Vector3([0, 0, -1]);
		this.up = new Vector3([0, 1, 0]);
		//console.log(this.eye.elements[0]);
		//console.log(this.at.elements[0]);
		//console.log(this.up.elements[0]);
		this.viewMatrix = new Matrix4();
		(this.viewMatrix.setLookAt)(...this.eye.elements, ...this.at.elements, ...this.up.elements);
		this.projectionMatrix = new Matrix4();
		(this.projectionMatrix.setPerspective)(this.fov, canvas.width/canvas.height, 0.1, 1000);
	}
	
	moveForward(speed) {
		let f = new Vector3(this.at.elements);
		//console.log(this.at);
		//f.set(this.at);
		f.sub(this.eye);
		//f.mul(-1);
		f.normalize(); 
		f.mul(speed);
		this.eye.add(f);
		this.at.add(f);
		this.viewMatrix.setLookAt(
        ...this.eye.elements, 
        ...this.at.elements, 
        ...this.up.elements
		);
	}
	
	moveBackward(speed) {
		let f = new Vector3(this.at.elements);
		//console.log(this.at);
		//f.set(this.at);
		f.sub(this.eye);
		f.mul(-1);
		f.normalize(); 
		f.mul(speed);
		this.eye.add(f);
		this.at.add(f);
		this.viewMatrix.setLookAt(
        ...this.eye.elements, 
        ...this.at.elements, 
        ...this.up.elements
		);
	}
	
	moveLeft(speed) {
		let f = new Vector3(this.at.elements);
		f.sub(this.eye);
		let s = new Vector3(this.up.elements);
		s = Vector3.cross(s, f);
		s.normalize();
		s.mul(speed);
		this.eye.add(s);
		this.at.add(s);
		this.viewMatrix.setLookAt(
        ...this.eye.elements, 
        ...this.at.elements, 
        ...this.up.elements
		);
	}
	
	moveRight(speed) {
		let f = new Vector3(this.at.elements);
		f.sub(this.eye);
		let s = new Vector3(this.up.elements);
		s = Vector3.cross(s, f);
		s.normalize();
		s.mul(-1);
		s.mul(speed);
		this.eye.add(s);
		this.at.add(s);
		this.viewMatrix.setLookAt(
        ...this.eye.elements, 
        ...this.at.elements, 
        ...this.up.elements
		);
	}
	
	panLeft(speed) {
		let f = new Vector3(this.at.elements);
		f.sub(this.eye);
		let rotationMatrix = new Matrix4();
		rotationMatrix.setRotate(speed, this.up.elements[0], this.up.elements[1], this.up.elements[2]);
		let f_prime = rotationMatrix.multiplyVector3(f);
		//console.log("f prime:");
		//console.log(f_prime);
		this.at.set(this.eye);
		this.at.add(f_prime);
		this.viewMatrix.setLookAt(
        ...this.eye.elements, 
        ...this.at.elements, 
        ...this.up.elements
		);
	}
	
	panRight(speed) {
		let f = new Vector3(this.at.elements);
		f.sub(this.eye);
		let rotationMatrix = new Matrix4();
		rotationMatrix.setRotate(-speed, this.up.elements[0], this.up.elements[1], this.up.elements[2]);
		let f_prime = rotationMatrix.multiplyVector3(f);
		//console.log("f prime:");
		//console.log(f_prime);
		this.at.set(this.eye);
		this.at.add(f_prime);
		this.viewMatrix.setLookAt(
        ...this.eye.elements, 
        ...this.at.elements, 
        ...this.up.elements
		);
	}
}
