type HasId = {
    id: string;
  };
  
  export const generateID = (list: any[], prefix: string) => {
    let max = 0;
  
    list.forEach(item => {
      const id = item.ContainerID || item.id; 
  
      if (id && id.toString().startsWith(prefix)) {
        const num = parseInt(id.toString().replace(prefix, ""));
        if (num > max) max = num;
      }
    });
  
    return prefix + String(max + 1).padStart(3, "0");
  };
  export const generateIDWithDate = <T extends HasId>(
    list: T[],
    prefix: string
  ): string => {
    const today = new Date();
    const dateStr =
      today.getFullYear().toString() +
      String(today.getMonth() + 1).padStart(2, "0") +
      String(today.getDate()).padStart(2, "0");
  
    let max = 0;
  
    list.forEach(item => {
      const regex = new RegExp(`^${prefix}${dateStr}(\\d+)$`);
      const match = item.id?.match(regex);
  
      if (match) {
        const num = parseInt(match[1]);
        if (num > max) max = num;
      }
    });
  
    return prefix + dateStr + String(max + 1).padStart(3, "0");
  };
  

  export const isIdExist = <T extends HasId>(
    list: T[],
    id: string
  ): boolean => {
    return list.some(item => item.id === id);
  };
  

  export const generateUniqueID = <T extends HasId>(
    list: T[],
    prefix: string
  ): string => {
    let newID = generateID(list, prefix);
  
    while (isIdExist(list, newID)) {
      const num = parseInt(newID.replace(prefix, "")) + 1;
      newID = prefix + String(num).padStart(3, "0");
    }
  
    return newID;
  };