export const ShowPassword = (inputID:string) => {
    var x = document.getElementById(inputID) as HTMLInputElement;
    var i = document.getElementById("showPass") as HTMLInputElement;
    x.type === "password" ? x.type = "text" : x.type = "password";
    i.classList.toggle("bi-eye");
    i.classList.toggle("bi-eye-slash");
}