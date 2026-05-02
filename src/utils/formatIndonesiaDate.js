export const formatIndonesiaDate = (date) => {
      const dayNames = ['Ahad', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
      const monthNames = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];

      date = new Date(date);
      const dayName = dayNames[date.getDay()];
      const day = date.getDate();
      const monthName = monthNames[date.getMonth()];
      const year = date.getFullYear();
      const hour = date.getHours();
      const minute = date.getMinutes();
      const second = date.getSeconds();

      const indonesianFormat = `${day} ${monthName} ${year} ${hour}:${minute} WIB`;
      return indonesianFormat
    }