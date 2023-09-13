const { createClient } = require('@supabase/supabase-js');

class Supabase {
  constructor() {
    this.TOKEN_LENGTH = 16;
    const supabaseUrl = "";
    const supabaseKey =
      "";

    this.supabase = createClient(supabaseUrl, supabaseKey);
  }

  async generateToken() {
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let token;

    do {
      token = "";
      for (let i = 0; i < this.TOKEN_LENGTH; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        token += characters[randomIndex];
      }
    } while (await this.lookupBoardByToken(token));

    return token;
  }

  async createBoard(pin) {
    //Gen. a unique token for the new board
    const token = await this.generateToken();
    console.log(token);

    try {
      const { error } = await this.supabase
        .from("boards")
        .insert([{ token, pin, data: {} }]);

      const newBoard = this.lookupBoardByToken(token);

      if (error || !newBoard) {
        console.log("Error creating board: ", error);
        return null;
      } else {
        return newBoard;
      }
    } catch (ex) {
      console.log("Error creating board: ", ex);
      return null;
    }
  }

  async insertJSONB(boardToken, object) {
    try {
      const { data, error } = await this.supabase
        .from("boards")
        .update(object)
        .match({ token: boardToken }); // Specify the row to update using a unique identifier (e.g., id)

      if (error) {
        throw error;
      }
  
    } catch (error) {
      console.error("Error inserting object data:", error.message);
    }
  }

  async insertShapes(boardToken, shapesArray) {
    await this.insertJSONB(boardToken, { shapes: shapesArray });
  }

  async insertLines(boardToken, linesArray) {
    await this.insertJSONB(boardToken, { lines: linesArray });
  }

  async lookupBoardByToken(token) {
    try {
      //Obtain board data by given token
      const { data, error } = await this.supabase
        .from("boards")
        .select("*")
        .eq("token", token)
        .single();

      if (error) {
        console.log("Error fetching board data: ", error);
        return null;
      } else {
        return data;
      }
    } catch (ex) {
      console.error("Error fetching board data: ", error);
      return null;
    }
  }
}

module.exports = Supabase;