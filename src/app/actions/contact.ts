"use server"

export async function submitContactForm(formData: FormData) {
  // Add the access key securely on the server side
  formData.append("access_key", "00cbef3d-678d-49c3-a2b7-23e6eb95be30");
  
  const domain = "api.web3forms.com";
  const endpoint = "submit";
  const url = `https://${domain}/${endpoint}`;

  try {
    const response = await fetch(url, {
      method: "POST",
      body: formData,
    });
    
    const data = await response.json();
    return data;
  } catch (error) {
    return { success: false, message: "An unexpected error occurred." };
  }
}
