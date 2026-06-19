"use server"

export async function submitContactForm(formData: FormData) {
  try {
    // We must create a new FormData object because the one passed from the client is read-only
    const newFormData = new FormData();
    newFormData.append("access_key", "00cbef3d-678d-49c3-a2b7-23e6eb95be30");
    newFormData.append("name", formData.get("name") as string || "");
    newFormData.append("email", formData.get("email") as string || "");
    newFormData.append("message", formData.get("message") as string || "");
    
    const domain = "api.web3forms.com";
    const endpoint = "submit";
    const url = `https://${domain}/${endpoint}`;

    const response = await fetch(url, {
      method: "POST",
      body: newFormData,
    });
    
    const data = await response.json();
    return data;
  } catch (error: any) {
    console.error("Web3Forms Error:", error);
    return { success: false, message: "Server Error: " + (error.message || "Unknown error") };
  }
}
