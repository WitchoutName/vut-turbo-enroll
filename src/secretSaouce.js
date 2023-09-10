const url = 'https://www.vut.cz/studis/student.phtml'; // Replace with your API endpoint
const headers = {
  'Content-Type': 'application/x-www-form-urlencoded',
  'Cookie': 'nosec_sess=jrQDjvI5yJ; fontsLoaded=true; vut_ack=vt4ZzWINx1GB1WzRklwm3PBfUqOJn1; cookiehub=eyJhbnN3ZXJlZCI6dHJ1ZSwicHJlY29uc2VudCI6ZmFsc2UsInJldmlzaW9uIjoxLCJkbnQiOmZhbHNlLCJhbGxvd1NhbGUiOnRydWUsImltcGxpY3QiOmZhbHNlLCJyZWdpb24iOiIiLCJ0b2tlbiI6IjMxaTJUSXpxRVljc3hhNkFBZHBmanNJcnhiVFd0T0xlZGNQanpRVHBqZ2ZEbkJPR2RvVGpuODBhWXRrGkk5N0MiLCJ0aW1lc3RhbXAiOiIyMDIzLTA5LTA4VDE1OjU1OjUyLjYyM1oiLCJjYXRlZ29yaWVzIjpbeyJjaWQiOjEsImlkIjoibmVjZXNzYXJ5IiwidmFsdWUiOnRydWUsInByZWNvbnNlbnQiOnRydWUsImZpcmVkIjp0cnVlfSx7ImNpZCI6MywiaWQiOiJhbmFseXRpY3MiLCJ2YWx1ZSI6ZmFsc2UsInByZWNvbnS23wESFOH&34ir80903inmvoiuv6w'
};

const formData = new URLSearchParams();
formData.append('script_name', 'registrace_vyucovani_act');
formData.append('typ_semestru_id', '');
formData.append('kontrola_vsech_rj', '1');
formData.append('zmena_semestru', '0');
formData.append('s_key', '96578305c6');
formData.append('s_tkey', '51TFNRwvT0');
formData.append('f_rj[382625]', '382625');
formData.append('rj[268294][382625]', '316122');
formData.append('potvrdit_volbu_vyucovani', 'Potvrdit+registraci+vyu%C4%8Dov%C3%A1n%C3%AD');

fetch(url, {
  method: 'POST',
  headers: headers,
  body: formData.toString(),
})
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response; // You can use .json() if the response is in JSON format
  })
  .then(data => {
    console.log(data); // Handle the response data
  })
  .catch(error => {
    console.error('There was a problem with the fetch operation:', error);
  });